import { createContext, useEffect, useState } from "react";
import { Data } from "../shared.types";

interface FlightsContextValues {
  flightsData: Data | null;
  flightsDataLoading: boolean;
  errorLoadingData: string;
}

interface FlightsProviderProps {
  children: React.ReactNode;
}

export const FlightsContext = createContext<FlightsContextValues | null>(null);

export function FlightsProvider({ children }: FlightsProviderProps) {
  const [flightsDataLoading, setFlightsDataLoading] = useState(false);
  const [errorLoadingData, setErrorLoadingData] = useState("");
  const [flightsData, setFlightsData] = useState<Data | null>(null);

  useEffect(function () {
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
  }, []);

  return (
    <FlightsContext.Provider
      value={{
        flightsData,
        flightsDataLoading,
        errorLoadingData,
      }}
    >
      {children}
    </FlightsContext.Provider>
  );
}
