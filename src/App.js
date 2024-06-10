import Sidebar from "./components/Sidebar";
import { Sorter, Filter, PickAirlines, PriceRange } from "./components/Sidebar";
import FlightList from "./components/FlightList";
import Logo from "./components/Logo";
import { useState, useEffect } from "react";

function App() {
  const [flightsData, setFlightsData] = useState(null);
  const [flightsDataLoading, setFlightsDataLoading] = useState(false);
  const [errorLoadingData, setErrorLoadingData] = useState("");
  const [sortBy, setSortBy] = useState("price-increase");
  const [filterBy, setFilterBy] = useState("");
  const [minPriceRange, setMinPriceRange] = useState(0);
  const [maxPriceRange, setMaxPriceRange] = useState(1000000);
  const [pickedAirlines, setPickedAirlines] = useState([]);


  useEffect(function () {

    async function importData() {
      try {
        setFlightsDataLoading(true);
        setErrorLoadingData("");

        const data = (await import("./flights.json")).default

        if (!data) throw new Error("Ошибка в загрузке данных");
        setFlightsData(data);
        // console.log(data)
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
        {/* <Sidebar sortBy={sortBy} onSortBy={setSortBy} filterBy={filterBy} onFilterBy={setFilterBy} maxPriceRange={maxPriceRange} minPriceRange={minPriceRange} onMaxPriceRange={setMaxPriceRange} onMinPriceRange={setMinPriceRange} pickedAirlines={pickedAirlines} onPickedAirlines={setPickedAirlines}></Sidebar> */}
        <Sidebar flightsData={flightsData}>
          <Sorter sortBy={sortBy} onSortBy={setSortBy} />
          <Filter filterBy={filterBy} onFilterBy={setFilterBy} />
          <PriceRange minPriceRange={minPriceRange} maxPriceRange={maxPriceRange} onMinPriceRange={setMinPriceRange} onMaxPriceRange={setMaxPriceRange} />
          <PickAirlines flightsData={flightsData} pickedAirlines={pickedAirlines} onPickAirlines={setPickedAirlines} />
        </Sidebar>
        <FlightList flightsData={flightsData} flightsDataLoading={flightsDataLoading} errorLoadingData={errorLoadingData}></FlightList>
      </div>
    </div >
  );
}

export default App;
