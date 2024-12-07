export type InputChangeEvent = React.ChangeEvent<HTMLInputElement>;

export interface Data {
  result: {
    flights: FlightContainer[];
    bestPrices: BestPrices;
  };
}

export interface BestPrices {
  ONE_CONNECTION: {
    bestFlights: BestPricesFlights[];
  };
  DIRECT: {
    bestFlights: BestPricesFlights[];
  };
}

export interface FlightContainer {
  hasExtendedFare: boolean;
  flight: FlightData;
  flightToken: string;
}

export interface BestPricesFlights {
  carrier: AirlineDescriptor;
  price: Price;
}

interface FlightData {
  carrier: AirlineDescriptor;
  price: PriceContainer;
  servicesStatuses: {
    baggage: Descriptor;
    exchange: Descriptor;
    refund: Descriptor;
  };
  airlineAlliance?: Descriptor;
  legs: FlightLegData[];
  exchange: {
    [index: string]: ExchangeInfo;
  };
  isTripartiteContractDiscountApplied: boolean;
  international: boolean;
  seats: SeatsData[];
  refund: {
    [index: string]: RefundInfo;
  };
}

interface RefundInfo {
  refundableBeforeDeparture: boolean;
  refundableAfterDeparture: boolean;
}

interface SeatsData {
  count: number;
  type: Descriptor;
}

interface ExchangeInfo {
  exchangeableBeforeDeparture: boolean;
  exchangeAfterDeparture: Price;
  exchangeBeforeDeparture: Price;
  exchangeableAfterDeparture: boolean;
}

interface PriceContainer {
  total: Price;
  totalFeeAndTaxes: Price;
  rates: {
    totalUsd: Price;
    totalEur: Price;
  };
  passengerPrices: passengerPrice[];
}

interface passengerPrice {
  total: Price;
  passengerType: Descriptor;
  singlePassengerTotal: Price;
  passengerCount: number;
  tariff: Price;
  feeAndTaxes: Price;
}

interface Price {
  amount: string;
  currency?: string;
  currencyCode: string;
}

export interface FlightLegData {
  duration: number;
  segments: Segment[];
}

interface Segment {
  classOfServiceCode: string;
  classOfService: Descriptor;
  departureAirport: Descriptor;
  departureCity: Descriptor;
  aircraft: Descriptor;
  travelDuration: number;
  arrivalCity: Descriptor;
  arrivalDate: string;
  flightNumber: string;
  techStopInfos: unknown[];
  departureDate: string;
  stops: number;
  servicesDetails: ServicesDetails;
  airline: AirlineDescriptor;
  starting: boolean;
  arrivalAirport: Descriptor;
}

interface Descriptor {
  uid: string;
  caption: string;
}

interface AirlineDescriptor extends Descriptor {
  airlineCode: string;
}
interface ServicesDetails {
  freeCabinLuggage: { [index: string]: unknown };
  paidCabinLuggage: { [index: string]: unknown };
  tariffName?: string;
  fareBasis: {
    [index: string]: string;
  };
  freeLuggage: {
    [index: string]: {
      pieces?: number;
      nil: boolean;
      unit?: string;
    };
  };
  paidLuggage: { [index: string]: unknown };
}
