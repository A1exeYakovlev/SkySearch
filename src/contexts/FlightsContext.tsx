import { createContext, useEffect, useState } from "react";
import {
  ActionToFlightList,
  BestPrices,
  Data,
  FlightContainer,
  FlightLegData,
} from "../shared.types";
import { useSearchParams } from "react-router-dom";

interface FlightsContextValues {
  filteredFlights: FlightContainer[] | null;
  setFilteredFlights: React.Dispatch<
    React.SetStateAction<FlightContainer[] | null>
  >;
  flightsDataLoading: boolean;
  setFlightsDataLoading: React.Dispatch<React.SetStateAction<boolean>>;
  errorLoadingData: string;
  setErrorLoadingData: React.Dispatch<React.SetStateAction<string>>;
  bestPricesArr: BestPrices;
}

interface FlightsProviderProps {
  children: React.ReactNode;
}

export const FlightsContext = createContext<FlightsContextValues | null>(null);

export function FlightsProvider({ children }: FlightsProviderProps) {
  const [flightsDataLoading, setFlightsDataLoading] = useState(false);
  const [errorLoadingData, setErrorLoadingData] = useState("");
  const [filteredFlights, setFilteredFlights] = useState<
    FlightContainer[] | null
  >(null);
  const [flightsData, setFlightsData] = useState<Data | null>(null);

  const [bestPricesArr, setBestPricesArr] = useState<BestPrices | null>(null);
  const [searchParams] = useSearchParams();

  const sortBy = searchParams.get("sortBy");
  const filterBy = searchParams.get("filterBy");
  const maxPriceRange = searchParams.get("maxPrice");
  const minPriceRange = searchParams.get("minPrice");

  useEffect(
    function () {
      async function importData() {
        try {
          setFlightsDataLoading(true);
          setErrorLoadingData("");

          const data = (await import("../flights.json")).default as Data;

          if (!data) throw new Error("Ошибка в загрузке данных");
          setFlightsData(data);
        } catch (err: unknown) {
          if (err instanceof Error) {
            console.error(err);
            setErrorLoadingData(err.message);
          } else {
            setErrorLoadingData(
              "Произошла неизвестная ошибка при загрузке данных"
            );
          }
        } finally {
          setFlightsDataLoading(false);
        }
      }
      importData();
    },
    [setFlightsData, setFlightsDataLoading, setErrorLoadingData]
  );

  useEffect(
    function filteringFlights() {
      if (!flightsData) return;
      const {
        result: { bestPrices, flights },
      } = flightsData;
      setBestPricesArr(bestPrices);
      setFilteredFlights(flights);

      const manageFlightList = function (
        current: FlightContainer[] | null,
        actionFunc: ActionToFlightList
      ): FlightContainer[] | null {
        if (Array.isArray(current)) {
          return actionFunc(current);
        }
        return null;
      };

      const filterPriceRange = function (
        current: FlightContainer[]
      ): FlightContainer[] {
        return current
          .filter(
            (flight) =>
              parseFloat(flight?.flight?.price?.total?.amount) >=
              (parseFloat(minPriceRange) || 0)
          )
          .filter(
            (flight) =>
              parseFloat(flight?.flight?.price?.total?.amount) <=
              (parseFloat(maxPriceRange) ||
                parseFloat(flight?.flight?.price.total.amount))
          );
      };

      setFilteredFlights((cur) => manageFlightList(cur, filterPriceRange));

      const filterFlightList = function (
        current: FlightContainer[]
      ): FlightContainer[] {
        if (filterBy === "single-transfer") {
          return current.filter(
            (flight: FlightContainer) =>
              flight?.flight?.legs[0]?.segments.length === 2 &&
              flight?.flight?.legs[1]?.segments.length === 2
          );
        }

        if (filterBy === "no-transfer") {
          return current.filter(
            (flight: FlightContainer) =>
              flight?.flight?.legs[0]?.segments.length === 1 &&
              flight?.flight?.legs[1]?.segments.length === 1
          );
        }

        return current;
      };

      setFilteredFlights((cur) => manageFlightList(cur, filterFlightList));

      const sortFlightList = function (
        current: FlightContainer[]
      ): FlightContainer[] {
        if (sortBy === "price-increase") {
          current.sort(
            (flightA: FlightContainer, flightB: FlightContainer) =>
              parseFloat(flightA?.flight?.price?.total?.amount) -
              parseFloat(flightB?.flight?.price?.total?.amount)
          );
        }

        if (sortBy === "price-decrease") {
          current.sort(
            (flightA: FlightContainer, flightB: FlightContainer) =>
              parseFloat(flightB?.flight?.price?.total?.amount) -
              parseFloat(flightA?.flight?.price?.total?.amount)
          );
        }

        if (sortBy === "travel-duration") {
          current.sort((flightA: FlightContainer, flightB: FlightContainer) => {
            const totalDurationA = flightA?.flight?.legs.reduce(
              (total: number, leg: FlightLegData) => total + leg?.duration,
              0
            );
            const totalDurationB = flightB?.flight?.legs.reduce(
              (total: number, leg: FlightLegData) => total + leg?.duration,
              0
            );
            return totalDurationA - totalDurationB;
          });
        }

        return current;
      };

      setFilteredFlights((cur) => manageFlightList(cur, sortFlightList));
    },
    [flightsData, searchParams, minPriceRange, maxPriceRange]
  );

  return (
    <FlightsContext.Provider
      value={{
        flightsDataLoading,
        setFlightsDataLoading,
        errorLoadingData,
        setErrorLoadingData,
        filteredFlights,
        setFilteredFlights,
        bestPricesArr,
      }}
    >
      {children}
    </FlightsContext.Provider>
  );
}
