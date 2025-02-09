import { FlightDate, FlightLegData } from "../shared.types";
import { getDateInfo } from "../utils/getDateInfo";

interface FlightLegProps {
  flightLeg: FlightLegData;
}

export default function FlightLeg({ flightLeg }: FlightLegProps) {
  if (!flightLeg) return;

  const arrivalDateObj: FlightDate = {
    year: 0,
    month: "",
    date: 0,
    dayOfWeek: "",
    hours: "00:00",
    minutes: "00:00",
  };

  const departureDateObj: FlightDate = {
    year: 0,
    month: "",
    date: 0,
    dayOfWeek: "",
    hours: "00:00",
    minutes: "00:00",
  };

  const travelDuration: { hours: number; minutes: number } = {
    hours: 0,
    minutes: 0,
  };

  const { airline, departureAirport, departureCity, departureDate } =
    flightLeg?.segments[0];
  const { arrivalAirport, arrivalCity, arrivalDate } =
    flightLeg?.segments[flightLeg?.segments.length - 1];
  const duration = flightLeg?.duration;

  if (duration) {
    travelDuration.hours = Math.floor(duration / 60);
    travelDuration.minutes = duration % 60;
  }
  const transferCount = flightLeg?.segments.length - 1;

  getDateInfo(departureDate, departureDateObj);
  getDateInfo(arrivalDate, arrivalDateObj);

  return (
    <div className="flight-leg">
      <p className="flight-leg__dest">
        {`${departureCity?.caption}, ${departureAirport?.caption}`}
        <span>{` (${departureAirport?.uid})`}</span>
        {`  ➡️  ${arrivalCity?.caption}, ${arrivalAirport?.caption}`}
        <span>{` (${arrivalAirport?.uid})`}</span>
      </p>
      <div className="flight-leg__time">
        <p>
          {`${departureDateObj.hours}:${departureDateObj.minutes}`}
          <span className="flight-leg__time-date">{` ${departureDateObj.date} ${departureDateObj.month} ${departureDateObj.dayOfWeek}`}</span>
        </p>
        <p>{`⌚ ${travelDuration.hours} ч ${travelDuration.minutes} мин`}</p>
        <p>
          <span className="flight-leg__time-date">{`${arrivalDateObj.date} ${arrivalDateObj.month} ${arrivalDateObj.dayOfWeek} `}</span>
          {`${arrivalDateObj.hours}:${arrivalDateObj.minutes}`}
        </p>
      </div>
      {!!transferCount && (
        <div className="flight-leg__transfer">{`${transferCount} пересадка`}</div>
      )}
      <p className="flight-leg__airline">
        {`Рейс выполняет: ${airline.caption}`}
      </p>
    </div>
  );
}
