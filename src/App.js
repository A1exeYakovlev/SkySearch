import Sidebar from "./components/Sidebar";
import { Sorter, Filter, PickAirlines, PriceRange } from "./components/Sidebar";
import FlightList from "./components/FlightList";
import Logo from "./components/Logo";
import { useState, useEffect, useRef } from "react";

function App() {
  const [flightsData, setFlightsData] = useState(null);
  const [flightsDataLoading, setFlightsDataLoading] = useState(false);
  const [errorLoadingData, setErrorLoadingData] = useState("");
  const [sortBy, setSortBy] = useState("price-increase");
  const [filterBy, setFilterBy] = useState("");
  const [minPriceRange, setMinPriceRange] = useState(0);
  const [maxPriceRange, setMaxPriceRange] = useState(1000000);
  const [pickedAirlines, setPickedAirlines] = useState([]);

  const highestPrice = useRef(0);

  useEffect(function () {
    if (flightsData) {
      highestPrice.current = flightsData?.result?.flights?.reduce((maxPrice, flight) => {
        const flightTotalPrice = parseInt(flight?.flight?.price?.total?.amount) || 0;
        return Math.max(maxPrice, flightTotalPrice);
      }, 0)

      setMaxPriceRange(highestPrice.current);
    }
  }, [flightsData, setFlightsData])

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

  return (
    <div className="app">
      <div className="container">
        <Logo />
        <Sidebar flightsData={flightsData}>
          <Sorter sortBy={sortBy} onSortBy={setSortBy} />
          <Filter filterBy={filterBy} onFilterBy={setFilterBy} />
          <PriceRange highestPrice={highestPrice} minPriceRange={minPriceRange} maxPriceRange={maxPriceRange} onMinPriceRange={setMinPriceRange} onMaxPriceRange={setMaxPriceRange} />
          <PickAirlines flightsData={flightsData} pickedAirlines={pickedAirlines} onPickAirlines={setPickedAirlines} />
        </Sidebar>
        <FlightList minPriceRange={minPriceRange} maxPriceRange={maxPriceRange} sortBy={sortBy} filterBy={filterBy} flightsData={flightsData} flightsDataLoading={flightsDataLoading} errorLoadingData={errorLoadingData}></FlightList>
      </div>
    </div >
  );
}

export default App;
