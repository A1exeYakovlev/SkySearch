import Sidebar from "./components/Sidebar";
import Sorter from "./components/Sorter";
import PickAirlines from "./components/PickAirlines";
import PriceRange from "./components/PriceRange";
import Filter from "./components/Filter";
import FlightList from "./components/FlightList";
import Logo from "./components/Logo";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useFlights } from "./hooks/useFlights";
import { FlightContainer } from "./shared.types";
import { FlightsProvider } from "./contexts/FlightsContext";

export default function App() {
  const [displayedNumber, setDisplayedNumber] = useState(2);
  const [searchParams] = useSearchParams();
  const [pickedAirlines, setPickedAirlines] = useState<string[] | null>(null);

  function handleShowMore() {
    setDisplayedNumber((curNum) => curNum + 2);
  }

  const { filteredFlights } = useFlights() || {};

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

  return (
    <div className="app">
      <div className="container">
        <FlightsProvider>
          <Logo />
          <Sidebar>
            <Sorter />
            <Filter />
            <PriceRange />
            <PickAirlines
              pickedAirlines={pickedAirlines}
              onPickedAirlines={setPickedAirlines}
            />
          </Sidebar>
          <FlightList
            displayedNumber={displayedNumber}
            onShowMore={handleShowMore}
            pickedAirlines={pickedAirlines}
          />
        </FlightsProvider>
      </div>
    </div>
  );
}
