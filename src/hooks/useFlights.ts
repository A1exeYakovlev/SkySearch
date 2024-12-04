import { useContext } from "react";
import { FlightsContext } from "../contexts/FlightsContext";

export function useFlights() {
  const context = useContext(FlightsContext);

  if (context === undefined)
    throw new Error("FlightsContext was used outside of FlightsProvider");

  return context;
}
