import { useState } from "react";
export default function FlightList({ filterBy, sortBy, flightsData, flightsDataLoading, errorLoadingData }) {

    const [displayedNumber, setDisplayedNumber] = useState(2);

    function handleShowMore() {
        setDisplayedNumber(curNum => curNum + 2)
    }

    let filteredFlights;

    if (flightsData) {
        const { result: { flights } } = flightsData;

        if (!filterBy) {
            filteredFlights = flights
        }

        if (filterBy === "single-transfer") {
            filteredFlights = flights.filter(flight => flight?.flight?.legs[0]?.segments.length === 2 && flight?.flight?.legs[1]?.segments.length === 2);
        }

        if (filterBy === "no-transfer") {
            filteredFlights = flights.filter(flight => flight?.flight?.legs[0]?.segments.length === 1 && flight?.flight?.legs[1]?.segments.length === 1);
        }

        console.log(filteredFlights)
        console.log(flightsData)

        if (sortBy === "price-increase") {
            filteredFlights.sort((flightA, flightB) => flightA?.flight?.price?.total?.amount - flightB?.flight?.price?.total?.amount);
        }

        if (sortBy === "price-decrease") {
            filteredFlights.sort((flightA, flightB) => flightB?.flight?.price?.total?.amount - flightA?.flight?.price?.total?.amount);
        }

        if (sortBy === "travel-duration") {
            filteredFlights.sort((flightA, flightB) => {
                const totalDurationA = flightA?.flight?.legs.reduce((total, leg) => total + leg?.duration, 0);
                const totalDurationB = flightB?.flight?.legs.reduce((total, leg) => total + leg?.duration, 0);
                return totalDurationA - totalDurationB;
            })
        }
    }

    return (

        <div>
            {filteredFlights && (
                filteredFlights.slice(0, displayedNumber).map((flight, i) => (
                    <Flight flight={flight} key={flight.flightToken} flightsDataLoading={flightsDataLoading} errorLoadingData={errorLoadingData}></Flight>
                ))
            )}

            <button onClick={handleShowMore}>Показать еще</button>
        </div>
    )
}

function Flight({ flightsDataLoading, errorLoadingData, flight }) {
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
                {flightsDataLoading && !errorLoadingData && <p>Данные загружаются</p>}
                {errorLoadingData && <p>{errorLoadingData}</p>}
                {flight && !errorLoadingData && (
                    <div className="flight-leg__top">
                        <p>{carrier?.caption}</p>

                        <div>
                            <p>{`${singlePassengerTotalPrice} ${singlePassengerTotalCur}`}</p>
                            <p>Стоимость для одного возрослого пассажира</p>
                        </div>
                    </div>
                )}
                {flight && (
                    flight?.flight?.legs.map((leg, i) => (
                        <FlightLeg flightLeg={leg} flightsDataLoading={flightsDataLoading} errorLoadingData={errorLoadingData} key={leg.segments[0]?.departureDate}></FlightLeg>
                    ))
                )
                }
                <button>Выбрать</button>
            </div>
        </div>)
}

function FlightLeg({ flightsDataLoading, errorLoadingData, flightLeg }) {

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
            {flightsDataLoading && !errorLoadingData && <p>Данные загружаются</p>}
            {errorLoadingData && <p>{errorLoadingData}</p>}
            {flightLeg && !errorLoadingData && (
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
                    </div >
                    {transferCount && (<div>{`${transferCount} пересадка`}</div>)
                    }
                    <p className="flight-leg__airline">
                        {`Рейс выполняет: ${airline.caption}`}
                    </p>

                </>)
            }
        </>
    )
}