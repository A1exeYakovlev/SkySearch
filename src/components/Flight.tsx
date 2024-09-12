import { FlightContainer, FlightLegData } from "../shared.types";
import FlightLeg from "./FlightLeg";

interface FlightProps {
  flight: FlightContainer;
}

export default function Flight({ flight }: FlightProps) {
  let singlePassengerTotalPrice;
  let singlePassengerTotalCur;
  let carrier;
  if (flight) {
    const { carrier: carr, price } = flight.flight;
    singlePassengerTotalPrice = Number(
      price?.passengerPrices[0]?.singlePassengerTotal?.amount
    );
    singlePassengerTotalCur =
      price?.passengerPrices[0]?.singlePassengerTotal?.currencyCode;
    carrier = carr;
  }

  return (
    <div className="flight app__flight">
      <div className="flight__top">
        <p>{carrier?.caption}</p>
        <div className="flight__top-info">
          <p className="flight__top-price">{`${singlePassengerTotalPrice} ${singlePassengerTotalCur}`}</p>
          <p className="flight__top-descr">
            Стоимость для одного взрослого пассажира
          </p>
        </div>
      </div>
      <div className="flight-leg-wrap">
        {flight &&
          flight?.flight?.legs.map((leg: FlightLegData, i: number) => (
            <FlightLeg flightLeg={leg} key={leg.segments[0]?.departureDate} />
          ))}
      </div>
      <button className="select-btn">Выбрать</button>
    </div>
  );
}
