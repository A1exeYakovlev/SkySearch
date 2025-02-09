import { FlightContainer, FlightLegData } from "../shared.types";

export const filterPriceRange = function (
  currentFlights: FlightContainer[],
  minPriceRange: string,
  maxPriceRange: string
): FlightContainer[] {
  return currentFlights
    .filter(
      (flight) =>
        parseFloat(flight?.flight?.price?.total?.amount) >=
        (parseFloat(minPriceRange) || 0)
    )
    .filter(
      (flight) =>
        parseFloat(flight?.flight?.price?.total?.amount) <=
        (parseFloat(maxPriceRange) ||
          parseFloat(flight?.flight?.price.total.amount))
    );
};

export const filterTransfer = function (
  currentFlights: FlightContainer[],
  filterBy: string
): FlightContainer[] {
  if (filterBy === "single-transfer") {
    return currentFlights.filter(
      (flight: FlightContainer) =>
        flight?.flight?.legs[0]?.segments.length === 2 &&
        flight?.flight?.legs[1]?.segments.length === 2
    );
  }

  if (filterBy === "no-transfer") {
    return currentFlights.filter(
      (flight: FlightContainer) =>
        flight?.flight?.legs[0]?.segments.length === 1 &&
        flight?.flight?.legs[1]?.segments.length === 1
    );
  }

  return currentFlights;
};

export const sortFlightList = function (
  currentFlights: FlightContainer[],
  sortBy: string
): FlightContainer[] {
  if (sortBy === "price-increase") {
    currentFlights.sort(
      (flightA: FlightContainer, flightB: FlightContainer) =>
        parseFloat(flightA?.flight?.price?.total?.amount) -
        parseFloat(flightB?.flight?.price?.total?.amount)
    );
  }

  if (sortBy === "price-decrease") {
    currentFlights.sort(
      (flightA: FlightContainer, flightB: FlightContainer) =>
        parseFloat(flightB?.flight?.price?.total?.amount) -
        parseFloat(flightA?.flight?.price?.total?.amount)
    );
  }

  if (sortBy === "travel-duration") {
    currentFlights.sort(
      (flightA: FlightContainer, flightB: FlightContainer) => {
        const totalDurationA = flightA?.flight?.legs.reduce(
          (total: number, leg: FlightLegData) => total + leg?.duration,
          0
        );
        const totalDurationB = flightB?.flight?.legs.reduce(
          (total: number, leg: FlightLegData) => total + leg?.duration,
          0
        );
        return totalDurationA - totalDurationB;
      }
    );
  }

  return currentFlights;
};

export function findPriceLimit(
  flights: FlightContainer[],
  priceLimit: "max" | "min"
): number {
  return flights.reduce((price, flight: FlightContainer) => {
    const flightTotalPrice =
      parseFloat(flight?.flight?.price?.total?.amount) || 0;

    if (priceLimit === "max") {
      return Math.max(price, flightTotalPrice);
    }

    if (priceLimit === "min") {
      return Math.min(price, flightTotalPrice);
    }
  }, parseFloat(flights[0]?.flight?.price?.total?.amount));
}
