import Sidebar from "./components/Sidebar";
import { Sorter, Filter, PickAirlines, PriceRange } from "./components/Sidebar";
import FlightList from "./components/FlightList";
import Logo from "./components/Logo";
import { useState, useEffect } from "react";

export default function App() {
  const [flightsData, setFlightsData] = useState(null);
  const [flightsDataLoading, setFlightsDataLoading] = useState(false);
  const [errorLoadingData, setErrorLoadingData] = useState("");
  const [sortBy, setSortBy] = useState("price-increase");
  const [filterBy, setFilterBy] = useState("");
  const [minPriceRange, setMinPriceRange] = useState("");
  const [maxPriceRange, setMaxPriceRange] = useState("");
  const [pickedAirlines, setPickedAirlines] = useState([]);
  const [displayedNumber, setDisplayedNumber] = useState(2);
  const [highestPrice, setHighestPrice] = useState("");
  const [lowestPrice, setLowestPrice] = useState(0);
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [bestPricesArr, setBestPricesArr] = useState([]);

  function handleShowMore() {
    setDisplayedNumber(curNum => curNum + 2)
  }

  useEffect(function () {
    async function importData() {
      try {
        setFlightsDataLoading(true);
        setErrorLoadingData("");

        const data = (await import("./flights.json")).default

        if (!data) throw new Error("Ошибка в загрузке данных");
        setFlightsData(data);
      } catch (err) {
        console.error(err);
        setErrorLoadingData(err.message)
      } finally { setFlightsDataLoading(false) }
    }
    importData();
  }, [setFlightsData, setFlightsDataLoading, setErrorLoadingData])

  useEffect(function filteringFlights() {

    if (flightsData) {
      const { result: { bestPrices, flights } } = flightsData;
      setBestPricesArr(bestPrices);
      setFilteredFlights(flights);

      setFilteredFlights((cur) => cur
        .filter(flight => (flight?.flight?.price?.total?.amount >= (minPriceRange || 0)))
        .filter(flight => (flight?.flight?.price?.total?.amount <= (maxPriceRange || flight?.flight?.price.total.amount)))
      );

      if (filterBy === "single-transfer") {
        setFilteredFlights((cur) => cur.filter(flight => flight?.flight?.legs[0]?.segments.length === 2 && flight?.flight?.legs[1]?.segments.length === 2));
      }

      if (filterBy === "no-transfer") {
        setFilteredFlights((cur) => cur.filter(flight => flight?.flight?.legs[0]?.segments.length === 1 && flight?.flight?.legs[1]?.segments.length === 1));
      }

      if (sortBy === "price-increase") {
        setFilteredFlights((cur) => cur.sort((flightA, flightB) => flightA?.flight?.price?.total?.amount - flightB?.flight?.price?.total?.amount));
      }

      if (sortBy === "price-decrease") {
        setFilteredFlights((cur) => cur.sort((flightA, flightB) => flightB?.flight?.price?.total?.amount - flightA?.flight?.price?.total?.amount));
      }

      if (sortBy === "travel-duration") {
        setFilteredFlights((cur) => cur.sort((flightA, flightB) => {
          const totalDurationA = flightA?.flight?.legs.reduce((total, leg) => total + leg?.duration, 0);
          const totalDurationB = flightB?.flight?.legs.reduce((total, leg) => total + leg?.duration, 0);
          return totalDurationA - totalDurationB;
        }))
      }
    }
  }, [flightsData, sortBy, filterBy, minPriceRange, maxPriceRange])

  useEffect(function updatePickedAirlines() {
    setPickedAirlines((cur) => cur.filter((airline) => {
      return filteredFlights.some((flight) => flight?.flight?.carrier?.caption === airline)
    }))
  }, [filteredFlights, setPickedAirlines])

  useEffect(function findPriceRange() {
    if (filteredFlights.length > 0) {
      setHighestPrice(filteredFlights.reduce((maxPrice, flight) => {
        const flightTotalPrice = parseInt(flight?.flight?.price?.total?.amount) || 0;
        return Math.max(maxPrice, flightTotalPrice);
      }, parseInt(filteredFlights[0]?.flight?.price?.total?.amount)))

      setLowestPrice(filteredFlights.reduce((minPrice, flight) => {
        const flightTotalPrice = parseInt(flight?.flight?.price?.total?.amount) || 0;
        return Math.min(minPrice, flightTotalPrice);
      }, parseInt(filteredFlights[0]?.flight?.price?.total?.amount)))
    }

  }, [filteredFlights, filterBy, setMaxPriceRange, setMinPriceRange])

  return (
    <div className="app">
      <div className="container">
        <Logo />
        <Sidebar flightsData={flightsData}>
          <Sorter sortBy={sortBy} onSortBy={setSortBy} />
          <Filter filterBy={filterBy} onFilterBy={setFilterBy} />
          <PriceRange lowestPrice={lowestPrice} highestPrice={highestPrice} minPriceRange={minPriceRange} maxPriceRange={maxPriceRange} onMinPriceRange={setMinPriceRange} onMaxPriceRange={setMaxPriceRange} />
          <PickAirlines minPriceRange={minPriceRange} maxPriceRange={maxPriceRange} flightsData={flightsData} flightsDataLoading={flightsDataLoading} errorLoadingData={errorLoadingData} filterBy={filterBy} bestPricesArr={bestPricesArr} filteredFlights={filteredFlights} pickedAirlines={pickedAirlines} onPickedAirlines={setPickedAirlines} />
        </Sidebar>
        <FlightList pickedAirlines={pickedAirlines} displayedNumber={displayedNumber} onShowMore={handleShowMore} minPriceRange={minPriceRange} maxPriceRange={maxPriceRange} sortBy={sortBy} filterBy={filterBy} filteredFlights={filteredFlights} flightsDataLoading={flightsDataLoading} errorLoadingData={errorLoadingData} />
      </div>
    </div>
  );
}
