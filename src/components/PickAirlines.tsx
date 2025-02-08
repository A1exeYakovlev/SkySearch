import { useEffect, useState } from "react";
import {
  BestPricesFlights,
  FlightContainer,
  InputChangeEvent,
} from "../shared.types";
import { useSearchParams } from "react-router-dom";
import { useFlights } from "../hooks/useFlights";
import { useFilteredFlights } from "../hooks/useFilteredFlights";

export default function PickAirlines() {
  const { flightsDataLoading, errorLoadingData } = useFlights() || {};
  const { filteredFlights, bestPricesArr, pickedAirlines, setPickedAirlines } =
    useFilteredFlights() || {};

  const [uniqueAirlinesArr, setUniqueAirlinesArr] = useState<string[] | null>(
    null
  );
  const [airlinesBestPrices, setAirlinesBestPrices] = useState<string[] | null>(
    null
  );
  const [searchParams] = useSearchParams();

  function handlePickAirline(e: InputChangeEvent) {
    const airline: string = e.target.value;

    setPickedAirlines((cur) => {
      if (!cur) {
        return [airline];
      }

      if (cur.includes(airline)) {
        return cur.filter((item) => item !== airline);
      }

      return [...cur, airline];
    });
  }

  useEffect(
    function updateUniqueAirlinesArr() {
      if (!filteredFlights) {
        setUniqueAirlinesArr(null);
        return;
      }

      if (Array.isArray(filteredFlights)) {
        setUniqueAirlinesArr(
          [
            ...new Set<string>(
              filteredFlights.map(
                (flight: FlightContainer) => flight?.flight?.carrier.caption
              )
            ),
          ].sort((a, b) => a.localeCompare(b))
        );
      }
    },
    [filteredFlights, setUniqueAirlinesArr]
  );

  useEffect(
    function updateAirlinesBestPrices() {
      function getAirlinesBestPrices(
        transfer: "ONE_CONNECTION" | "DIRECT"
      ): string[] | null {
        if (!uniqueAirlinesArr || !bestPricesArr) return null;
        return uniqueAirlinesArr.map((airline) => {
          const relevantBestFlights = bestPricesArr[
            transfer
          ]?.bestFlights.filter(
            (filteredFlight: BestPricesFlights) =>
              filteredFlight?.carrier?.caption === airline
          );

          const currency = relevantBestFlights[0]?.price?.currency;
          const price = relevantBestFlights.reduce(
            (minPrice: number, flight: BestPricesFlights) => {
              const curPrice = parseFloat(flight?.price?.amount);
              return Math.min(minPrice, curPrice);
            },
            parseFloat(relevantBestFlights[0]?.price?.amount)
          );
          return `${price} ${currency}`;
        });
      }

      const filterBy = searchParams.get("filterBy");

      if (filterBy === "single-transfer") {
        setAirlinesBestPrices(() => getAirlinesBestPrices("ONE_CONNECTION"));
      }

      if (filterBy === "no-transfer") {
        setAirlinesBestPrices(() => getAirlinesBestPrices("DIRECT"));
      }

      if (!filterBy) {
        const single = getAirlinesBestPrices("ONE_CONNECTION") || [];
        const direct = getAirlinesBestPrices("DIRECT") || [];
        setAirlinesBestPrices([...new Set([...single, ...direct])]);
      }
    },
    [
      filteredFlights,
      bestPricesArr,
      setAirlinesBestPrices,
      uniqueAirlinesArr,
      searchParams,
    ]
  );

  return (
    <div className="sidebar__wrap">
      <p className="sidebar__caption">Авиакомпании</p>
      {flightsDataLoading && !errorLoadingData && (
        <p className="sidebar__message">Данные загружаются...</p>
      )}
      {errorLoadingData && <p>{errorLoadingData}</p>}
      {!flightsDataLoading && !uniqueAirlinesArr && !errorLoadingData && (
        <p className="message--sidebar">Нет совпадений</p>
      )}
      {!flightsDataLoading && uniqueAirlinesArr && !errorLoadingData && (
        <div>
          {uniqueAirlinesArr.map((airline, i) => (
            <div className="sidebar__input-row" key={airline}>
              <input
                id={`airlines-checkbox${i}`}
                type="checkbox"
                name="airlines"
                value={airline}
                checked={pickedAirlines?.includes(airline) || false}
                onChange={handlePickAirline}
              />
              <label
                className="sidebar__label"
                htmlFor={`airlines-checkbox${i}`}
              >{` - ${airline}`}</label>
              <span className="sidebar__label-price">
                {airlinesBestPrices ? ` от ${airlinesBestPrices[i]}` : ""}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
