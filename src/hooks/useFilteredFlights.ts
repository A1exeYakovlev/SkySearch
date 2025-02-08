import { useContext } from "react";
import { FilteredFlightsContext } from "../contexts/FilteredFlightsContext";

export function useFilteredFlights() {
  const context = useContext(FilteredFlightsContext);

  if (context === undefined)
    throw new Error(
      "FilteredFlightsContext was used outside of FilteredFlightsProvider"
    );

  return context;
}
