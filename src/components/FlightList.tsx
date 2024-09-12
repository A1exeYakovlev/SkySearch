import { useEffect, useState } from "react";
import { FlightContainer } from "../shared.types";
import Flight from "./Flight";

interface FlightListProps {
  pickedAirlines: string[] | null;
  displayedNumber: number;
  onShowMore: () => void;
  filteredFlights: FlightContainer[] | null;
  flightsDataLoading: boolean;
  errorLoadingData: string;
}

export default function FlightList({
  pickedAirlines,
  displayedNumber,
  onShowMore,
  filteredFlights,
  flightsDataLoading,
  errorLoadingData,
}: FlightListProps) {
  const [flightsToDisplay, setFlightsToDisplay] = useState<
    FlightContainer[] | null
  >(null);

  useEffect(
    function filterAirlines() {
      if (filteredFlights && pickedAirlines && pickedAirlines.length > 0) {
        setFlightsToDisplay(() =>
          filteredFlights.filter((flight) =>
            pickedAirlines.includes(flight?.flight?.carrier?.caption)
          )
        );
      } else setFlightsToDisplay(filteredFlights);
    },
    [filteredFlights, pickedAirlines]
  );

  return (
    <>
      {flightsDataLoading && !errorLoadingData && (
        <p className="app__flightlist-message">Данные загружаются...</p>
      )}
      {errorLoadingData && (
        <p className="app__flightlist-message">{errorLoadingData}</p>
      )}
      {!flightsDataLoading &&
        flightsToDisplay &&
        flightsToDisplay.length === 0 &&
        !errorLoadingData && (
          <p className="app__flightlist-message">Нет подходящих рейсов</p>
        )}
      {!flightsDataLoading &&
        flightsToDisplay &&
        flightsToDisplay.length > 0 &&
        !errorLoadingData && (
          <div className="app__flightlist">
            {flightsToDisplay.slice(0, displayedNumber).map((flight, i) => (
              <Flight flight={flight} key={flight.flightToken} />
            ))}
            <button
              className="app__show-more-btn show-more-btn"
              onClick={onShowMore}
            >
              Показать еще
            </button>
          </div>
        )}
    </>
  );
}
