import { FlightLegData } from "../shared.types";

interface FlightLegProps {
  flightLeg: FlightLegData;
}

interface FlightDate {
  year: number;
  month: string;
  date: number;
  dayOfWeek: string;
  hours: number;
  minutes: number;
}

export default function FlightLeg({ flightLeg }: FlightLegProps) {
  if (!flightLeg) return;

  const arrivalDateObj: FlightDate = {
    year: 0,
    month: "",
    date: 0,
    dayOfWeek: "",
    hours: 0,
    minutes: 0,
  };

  const departureDateObj: FlightDate = {
    year: 0,
    month: "",
    date: 0,
    dayOfWeek: "",
    hours: 0,
    minutes: 0,
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

  function getDateInfo(inputData: string, outputDate: FlightDate) {
    const dateObj = new Date(inputData);
    const monthArr = [
      "янв",
      "фев",
      "мар",
      "апр",
      "май",
      "июн",
      "июл",
      "авг",
      "сен",
      "окт",
      "ноя",
      "дек",
    ];
    const daysOfWeek = ["вс", "пн", "вт", "ср", "чт", "пт", "сб"];
    outputDate.year = dateObj.getFullYear();
    outputDate.month = monthArr[dateObj.getMonth()];
    outputDate.date = dateObj.getDate();
    outputDate.dayOfWeek = daysOfWeek[dateObj.getDay()];
    outputDate.hours = dateObj.getHours();
    outputDate.minutes = dateObj.getMinutes();
  }

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
