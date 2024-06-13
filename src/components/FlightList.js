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
            {flightsDataLoading && !errorLoadingData && <p className="app__flightlist-message">Данные загружаются...</p>}
            {errorLoadingData && <p className="app__flightlist-message">{errorLoadingData}</p>}
            {!flightsDataLoading && flightsToDisplay.length === 0 && !errorLoadingData && (<p className="app__flightlist-message">Нет подходящих рейсов</p>)}
            {!flightsDataLoading && flightsToDisplay.length > 0 && !errorLoadingData && (
                <div className="app__flightlist">
                    {flightsToDisplay.slice(0, displayedNumber).map((flight, i) => (
                        <Flight flight={flight} key={flight.flightToken} />
                    ))
                    }
                    <button className="app__show-more-btn show-more-btn" onClick={onShowMore}>Показать еще</button>
                </div>
            )}
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
        <div className="flight app__flight">
            <div className="flight__top">
                <p>{carrier?.caption}</p>
                <div className="flight__top-info">
                    <p className="flight__top-price">{`${singlePassengerTotalPrice} ${singlePassengerTotalCur}`}</p>
                    <p className="flight__top-descr">Стоимость для одного взрослого пассажира</p>
                </div>
            </div>
            <div className="flight-leg-wrap">
                {flight && (
                    flight?.flight?.legs.map((leg, i) => (
                        <FlightLeg flightLeg={leg} key={leg.segments[0]?.departureDate} />
                    ))
                )
                }
            </div>
            <button className="select-btn">Выбрать</button>
        </div>
    )
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
        <div className="flight-leg">
            <p className="flight-leg__dest">
                {`${departureCity?.caption}, ${departureAirport?.caption}`}
                <span>{` (${departureAirport?.uid})`}</span>
                {`  ➡️  ${arrivalCity?.caption}, ${arrivalAirport?.caption}`}
                <span>{` (${arrivalAirport?.uid})`}</span>
            </p>
            <div className="flight-leg__time">
                <p>
                    {`${departureDate.hours}:${departureDate.minutes}`}
                    <span className="flight-leg__time-date">{` ${departureDate.date} ${departureDate.month} ${departureDate.dayOfWeek}`}</span>
                </p>
                <p>
                    {`⌚ ${travelDuration.hours} ч ${travelDuration.minutes} мин`}
                </p>
                <p>
                    <span className="flight-leg__time-date">{`${arrivalDate.date} ${arrivalDate.month} ${arrivalDate.dayOfWeek} `}</span>
                    {`${arrivalDate.hours}:${arrivalDate.minutes}`}
                </p>
            </div>
            {!!transferCount && (<div className="flight-leg__transfer">{`${transferCount} пересадка`}</div>)}
            <p className="flight-leg__airline">
                {`Рейс выполняет: ${airline.caption}`}
            </p>
        </div>
    )
}

