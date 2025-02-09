import { createContext, useEffect, useState } from "react";
import { useFlights } from "../hooks/useFlights";
import { BestPrices, FlightContainer } from "../shared.types";
import {
  filterPriceRange,
  filterTransfer,
  findPriceLimit,
  sortFlightList,
} from "../utils/filteredFlightsUtils";
import { useSearchParams } from "react-router-dom";

interface FilteredFlightsContextValues {
  filteredFlights: FlightContainer[] | null;
  bestPricesArr: BestPrices;
  lowestPrice: number;
  highestPrice: number;
  pickedAirlines: string[] | null;
  setPickedAirlines: React.Dispatch<React.SetStateAction<string[] | null>>;
}
interface FilteredFlightsProviderProps {
  children: React.ReactNode;
}

export const FilteredFlightsContext =
  createContext<FilteredFlightsContextValues | null>(null);

export function FilteredFlightsProvider({
  children,
}: FilteredFlightsProviderProps) {
  const [filteredFlights, setFilteredFlights] = useState<
    FlightContainer[] | null
  >(null);
  const [bestPricesArr, setBestPricesArr] = useState<BestPrices | null>(null);
  const [highestPrice, setHighestPrice] = useState<number | null>(null);
  const [lowestPrice, setLowestPrice] = useState(0);
  const [pickedAirlines, setPickedAirlines] = useState<string[] | null>(null);

  const { flightsData } = useFlights();
  const [searchParams] = useSearchParams();

  const sortBy = searchParams.get("sortBy");
  const filterBy = searchParams.get("filterBy");
  const maxPriceRange = searchParams.get("maxPrice");
  const minPriceRange = searchParams.get("minPrice");

  useEffect(
    function filteringFlights() {
      if (!flightsData) return;
      const {
        result: { bestPrices, flights },
      } = flightsData;
      setBestPricesArr(bestPrices);

      let updatedFilteredFlights = flights;

      if (Array.isArray(updatedFilteredFlights)) {
        updatedFilteredFlights = filterPriceRange(
          updatedFilteredFlights,
          minPriceRange,
          maxPriceRange
        );

        updatedFilteredFlights = filterTransfer(
          updatedFilteredFlights,
          filterBy
        );
        updatedFilteredFlights = sortFlightList(updatedFilteredFlights, sortBy);
      }

      setFilteredFlights(() => updatedFilteredFlights);
    },
    [flightsData, minPriceRange, maxPriceRange, sortBy, filterBy]
  );

  useEffect(
    function findPriceRange() {
      if (!filteredFlights) return;

      setLowestPrice(findPriceLimit(filteredFlights, "min"));
      setHighestPrice(findPriceLimit(filteredFlights, "max"));
    },
    [filteredFlights]
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
    [filteredFlights]
  );

  return (
    <FilteredFlightsContext.Provider
      value={{
        filteredFlights,
        bestPricesArr,
        lowestPrice,
        highestPrice,
        pickedAirlines,
        setPickedAirlines,
      }}
    >
      {children}
    </FilteredFlightsContext.Provider>
  );
}
