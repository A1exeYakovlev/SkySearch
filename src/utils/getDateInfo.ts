import { FlightDate } from "../shared.types";

export function getDateInfo(inputData: string, outputDate: FlightDate) {
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
  outputDate.hours = timeFormat(dateObj.getHours());
  outputDate.minutes = timeFormat(dateObj.getMinutes());

  function timeFormat(number: number): string {
    return String(number < 10 ? `0${number}` : number);
  }
}
