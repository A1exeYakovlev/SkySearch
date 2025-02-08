import Sidebar from "./components/Sidebar";
import Sorter from "./components/Sorter";
import PickAirlines from "./components/PickAirlines";
import PriceRange from "./components/PriceRange";
import Filter from "./components/Filter";
import FlightList from "./components/FlightList";
import Logo from "./components/Logo";
import { FlightsProvider } from "./contexts/FlightsContext";
import { FilteredFlightsProvider } from "./contexts/FilteredFlightsContext";

export default function App() {
  return (
    <div className="app">
      <div className="container">
        <FlightsProvider>
          <FilteredFlightsProvider>
            <Logo />
            <Sidebar>
              <Sorter />
              <Filter />
              <PriceRange />
              <PickAirlines />
            </Sidebar>
            <FlightList />
          </FilteredFlightsProvider>
        </FlightsProvider>
      </div>
    </div>
  );
}
