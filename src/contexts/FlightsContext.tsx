import { createContext, useEffect, useState } from "react";
import { BestPrices, Data, FlightContainer } from "../shared.types";
import { useSearchParams } from "react-router-dom";
import {
  filterPriceRange,
  filterTransfer,
  findPriceLimit,
  sortFlightList,
} from "../utils/FlightsUtils";

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
  lowestPrice: number;
  highestPrice: number;
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
  const [highestPrice, setHighestPrice] = useState<number | null>(null);
  const [lowestPrice, setLowestPrice] = useState(0);

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

      setFilteredFlights((cur) => updatedFilteredFlights);
    },
    [flightsData, searchParams, minPriceRange, maxPriceRange]
  );

  useEffect(
    function findPriceRange() {
      if (!filteredFlights) return;

      setLowestPrice(findPriceLimit(filteredFlights, "min"));
      setHighestPrice(findPriceLimit(filteredFlights, "max"));
    },
    [filteredFlights, searchParams]
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
        lowestPrice,
        highestPrice,
      }}
    >
      {children}
    </FlightsContext.Provider>
  );
}
