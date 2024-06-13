import { useEffect, useState } from "react";

export default function FlightList({ pickedAirlines, displayedNumber, onShowMore, filteredFlights, flightsDataLoading, errorLoadingData }) {
    const [flightsToDisplay, setFlightsToDisplay] = useState([]);

    useEffect(function filterAirlines() {
        if (filteredFlights.length > 0 && pickedAirlines.length > 0) {
            setFlightsToDisplay((cur) => filteredFlights.filter(flight => (pickedAirlines.includes(flight?.flight?.carrier?.caption))));
        }

        else setFlightsToDisplay(filteredFlights);
    }, [filteredFlights, pickedAirlines])

    return (
        <>
            {flightsDataLoading && !errorLoadingData && <p className="message">Данные загружаются...</p>}
            {errorLoadingData && <p>{errorLoadingData}</p>}
            {!flightsDataLoading && flightsToDisplay.length === 0 && !errorLoadingData && (<p className="message">Нет подходящих рейсов</p>)}
            {!flightsDataLoading && flightsToDisplay.length > 0 && !errorLoadingData && (
                <div>
                    {flightsToDisplay.slice(0, displayedNumber).map((flight, i) => (
                        <Flight flight={flight} key={flight.flightToken} />
                    ))
                    }</div>
            )}
            <button onClick={onShowMore}>Показать еще</button>
        </>
    )
}

function Flight({ flight }) {
    let singlePassengerTotalPrice;
    let singlePassengerTotalCur;
    let carrier;
    if (flight) {
        const { carrier: carr, price } = flight.flight;
        singlePassengerTotalPrice = Number(price?.passengerPrices[0]?.singlePassengerTotal?.amount);
        singlePassengerTotalCur = price?.passengerPrices[0]?.singlePassengerTotal?.currencyCode;
        carrier = carr;
    }

    return (
        <div className="app__flightlist">
            <div className="flight-leg">
                <div className="flight-leg__top">
                    <p>{carrier?.caption}</p>
                    <div className="flight-leg__top-info">
                        <p className="flight-leg__top-price">{`${singlePassengerTotalPrice} ${singlePassengerTotalCur}`}</p>
                        <p className="flight-leg__top-descr">Стоимость для одного взрослого пассажира</p>
                    </div>
                </div>
                {flight && (
                    flight?.flight?.legs.map((leg, i) => (
                        <FlightLeg flightLeg={leg} key={leg.segments[0]?.departureDate} />
                    ))
                )
                }
                <button>Выбрать</button>
            </div>
        </div>)
}

function FlightLeg({ flightLeg }) {

    let departureCity;
    let departureAirport;
    let arrivalCity;
    let arrivalAirport;
    let arrivalDate = {};
    let departureDate = {};
    let airline;
    let travelDuration = {};
    let transferCount;

    if (flightLeg) {
        const { airline: arln, departureAirport: departAir, departureCity: departCity, departureDate: departDate } = flightLeg?.segments[0];
        const { arrivalAirport: arrivAir, arrivalCity: arrivCity, arrivalDate: arrivDate } = flightLeg?.segments.at(-1);
        const duration = flightLeg?.duration;
        departureCity = departCity;
        departureAirport = departAir;
        arrivalCity = arrivCity;
        arrivalAirport = arrivAir;
        airline = arln;
        travelDuration.hours = Math.floor(duration / 60);
        travelDuration.minutes = duration % 60;
        transferCount = flightLeg?.segments.length - 1;

        function getDateInfo(inputData, outputDate) {
            const dateObj = new Date(inputData);
            const monthArr = ["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"];
            const daysOfWeek = ["вс", "пн", "вт", "ср", "чт", "пт", "сб"]
            outputDate.year = dateObj.getFullYear();
            outputDate.month = monthArr[dateObj.getMonth()];
            outputDate.date = dateObj.getDate();
            outputDate.dayOfWeek = daysOfWeek[dateObj.getDay()];
            outputDate.hours = dateObj.getHours();
            outputDate.minutes = dateObj.getMinutes();
        }

        getDateInfo(departDate, departureDate)
        getDateInfo(arrivDate, arrivalDate)
    }

    return (
        <>
            <p className="flight-leg__dest">
                {`${departureCity?.caption}, ${departureAirport?.caption}`}
                <span>{` (${departureAirport?.uid})`}</span>
                {` ➡️ ${arrivalCity?.caption}, ${arrivalAirport?.caption}`}
                <span>{` (${arrivalAirport?.uid})`}</span>
            </p>
            <div className="flight-leg__time">
                <p>
                    {`${departureDate.hours}:${departureDate.minutes}`}
                    <span>{` ${departureDate.date} ${departureDate.month} ${departureDate.dayOfWeek}`}</span>
                </p>
                <p>
                    {`⌚ ${travelDuration.hours} ч ${travelDuration.minutes} мин`}
                </p>
                <p>
                    <span>{`${arrivalDate.date} ${arrivalDate.month} ${arrivalDate.dayOfWeek} `}</span>
                    {`${arrivalDate.hours}:${arrivalDate.minutes}`}
                </p>
            </div>
            {transferCount && (<div>{`${transferCount} пересадка`}</div>)
            }
            <p className="flight-leg__airline">
                {`Рейс выполняет: ${airline.caption}`}
            </p>
        </>)
}

