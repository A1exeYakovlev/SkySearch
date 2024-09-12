import Sidebar from "./components/Sidebar";
import Sorter from "./components/Sorter";
import PickAirlines from "./components/PickAirlines";
import PriceRange from "./components/PriceRange";
import Filter from "./components/Filter";
import FlightList from "./components/FlightList";
import Logo from "./components/Logo";
import { useState, useEffect } from "react";

import {
  ActionToFlightList,
  BestPrices,
  Data,
  FlightContainer,
  FlightLegData,
} from "./shared.types";

export default function App() {
  const [flightsData, setFlightsData] = useState<Data | null>(null);
  const [flightsDataLoading, setFlightsDataLoading] = useState(false);
  const [errorLoadingData, setErrorLoadingData] = useState("");
  const [sortBy, setSortBy] = useState("price-increase");
  const [filterBy, setFilterBy] = useState("");
  const [minPriceRange, setMinPriceRange] = useState<number | null>(null);
  const [maxPriceRange, setMaxPriceRange] = useState<number | null>(null);
  const [pickedAirlines, setPickedAirlines] = useState<string[] | null>(null);
  const [displayedNumber, setDisplayedNumber] = useState(2);
  const [highestPrice, setHighestPrice] = useState<number | null>(null);
  const [lowestPrice, setLowestPrice] = useState(0);
  const [filteredFlights, setFilteredFlights] = useState<
    FlightContainer[] | null
  >(null);
  const [bestPricesArr, setBestPricesArr] = useState<BestPrices | null>(null);

  function handleShowMore() {
    setDisplayedNumber((curNum) => curNum + 2);
  }

  useEffect(
    function () {
      async function importData() {
        try {
          setFlightsDataLoading(true);
          setErrorLoadingData("");

          const data = (await import("./flights.json")).default as Data;

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
              (minPriceRange || 0)
          )
          .filter(
            (flight) =>
              parseFloat(flight?.flight?.price?.total?.amount) <=
              (maxPriceRange || parseFloat(flight?.flight?.price.total.amount))
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
    [flightsData, sortBy, filterBy, minPriceRange, maxPriceRange]
  );

  useEffect(
    function updatePickedAirlines() {
      if (!filteredFlights) return;

      setPickedAirlines((cur) => {
        if (!cur) return null;

        return cur.filter((airline) => {
          return filteredFlights.some(
            (flight: FlightContainer) =>
              flight?.flight?.carrier?.caption === airline
          );
        });
      });
    },
    [filteredFlights, setPickedAirlines]
  );

  useEffect(
    function findPriceRange() {
      if (!filteredFlights) return;

      setHighestPrice(
        filteredFlights.reduce((maxPrice, flight: FlightContainer) => {
          const flightTotalPrice =
            parseFloat(flight?.flight?.price?.total?.amount) || 0;
          return Math.max(maxPrice, flightTotalPrice);
        }, parseFloat(filteredFlights[0]?.flight?.price?.total?.amount))
      );

      setLowestPrice(
        filteredFlights.reduce((minPrice, flight: FlightContainer) => {
          const flightTotalPrice =
            parseInt(flight?.flight?.price?.total?.amount) || 0;
          return Math.min(minPrice, flightTotalPrice);
        }, parseInt(filteredFlights[0]?.flight?.price?.total?.amount))
      );
    },
    [filteredFlights, filterBy, setMaxPriceRange, setMinPriceRange]
  );

  return (
    <div className="app">
      <div className="container">
        <Logo />
        <Sidebar>
          <Sorter sortBy={sortBy} onSortBy={setSortBy} />
          <Filter filterBy={filterBy} onFilterBy={setFilterBy} />
          <PriceRange
            lowestPrice={lowestPrice}
            highestPrice={highestPrice}
            minPriceRange={minPriceRange}
            maxPriceRange={maxPriceRange}
            onMinPriceRange={setMinPriceRange}
            onMaxPriceRange={setMaxPriceRange}
          />
          <PickAirlines
            flightsDataLoading={flightsDataLoading}
            errorLoadingData={errorLoadingData}
            filterBy={filterBy}
            bestPricesArr={bestPricesArr}
            filteredFlights={filteredFlights}
            pickedAirlines={pickedAirlines}
            onPickedAirlines={setPickedAirlines}
          />
        </Sidebar>
        <FlightList
          pickedAirlines={pickedAirlines}
          displayedNumber={displayedNumber}
          onShowMore={handleShowMore}
          filteredFlights={filteredFlights}
          flightsDataLoading={flightsDataLoading}
          errorLoadingData={errorLoadingData}
        />
      </div>
    </div>
  );
}
