import Sidebar from "./components/Sidebar";
import Sorter from "./components/Sorter";
import PickAirlines from "./components/PickAirlines";
import PriceRange from "./components/PriceRange";
import Filter from "./components/Filter";
import FlightList from "./components/FlightList";
import Logo from "./components/Logo";
import { useEffect, useState } from "react";
import { FlightsProvider } from "./contexts/FlightsContext";
import { useSearchParams } from "react-router-dom";
import { useFlights } from "./hooks/useFlights";
import { FlightContainer } from "./shared.types";

export default function App() {
  const [displayedNumber, setDisplayedNumber] = useState(2);
  const [highestPrice, setHighestPrice] = useState<number | null>(null);
  const [lowestPrice, setLowestPrice] = useState(0);
  const [searchParams] = useSearchParams();
  const [pickedAirlines, setPickedAirlines] = useState<string[] | null>(null);

  function handleShowMore() {
    setDisplayedNumber((curNum) => curNum + 2);
  }

  const { filteredFlights } = useFlights() || {};

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
    [filteredFlights, searchParams]
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

  return (
    <div className="app">
      <div className="container">
        <FlightsProvider>
          <Logo />
          <Sidebar>
            <Sorter />
            <Filter />
            <PriceRange lowestPrice={lowestPrice} highestPrice={highestPrice} />
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
