import { useEffect, useState } from "react"

export default function FlightList() {


    function Flight() {
        const [flightsData, setFlightsData] = useState(null);
        const [flightsDataLoading, setFlightsDataLoading] = useState(false);
        const [errorLoadingData, setErrorLoadingData] = useState("");

        let flightsArr;

        if (flightsData) {
            const { result: { flights } } = flightsData;
            flightsArr = flights;
            // console.log(flightsArr)
        }

        useEffect(function () {

            async function importData() {
                try {
                    setFlightsDataLoading(true);
                    setErrorLoadingData("");

                    const data = (await import("../flights.json")).default

                    if (!data) throw new Error("Ошибка в загрузке данных");
                    setFlightsData(data);
                    // console.log(data)
                } catch (err) {
                    console.error(err);
                    setErrorLoadingData(err.message)
                } finally { setFlightsDataLoading(false) }
            }
            importData();
        }, [setFlightsData, setFlightsDataLoading, setErrorLoadingData])


        return (
            <div className="app__flightlist">
                {flightsArr && (
                    flightsArr[0]?.flight?.legs.map((leg, i) => (
                        <FlightLeg flightLegNum={i} flightsData={flightsData} flightsDataLoading={flightsDataLoading} errorLoadingData={errorLoadingData} key={leg.segments[0].departureCity.uid}></FlightLeg>
                    ))
                )}
                <button>Выбрать</button>
            </div>
        )



    }

    function FlightLeg({ flightsData, flightsDataLoading, errorLoadingData, flightLegNum }) {

        let flightsArr;
        let departureCity;
        let departureAirport;
        let arrivalCity;
        let arrivalAirport;
        let arrivalDate = {};
        let departureDate = {};
        let airline;
        let travelDuration = {};
        let transferCount;


        if (flightsData) {
            const { result: { flights } } = flightsData;
            flightsArr = flights;
            const { airline: arln, departureAirport: departAir, departureCity: departCity, departureDate: departDate } = flightsArr[0]?.flight?.legs[flightLegNum]?.segments[0];
            const { arrivalAirport: arrivAir, arrivalCity: arrivCity, arrivalDate: arrivDate } = flightsArr[0]?.flight?.legs[flightLegNum]?.segments.at(-1);
            const duration = flightsArr[0]?.flight?.legs[flightLegNum]?.duration;
            departureCity = departCity;
            departureAirport = departAir;
            arrivalCity = arrivCity;
            arrivalAirport = arrivAir;
            airline = arln;
            travelDuration.hours = Math.floor(duration / 60);
            travelDuration.minutes = duration % 60;
            transferCount = flightsArr[0]?.flight?.legs[flightLegNum]?.segments.length - 1;

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
                {flightsData && !errorLoadingData && (
                    <div className="flight-leg">
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
                    </div >)
                }
            </>
        )
    }




    return (
        <div>
            <Flight></Flight>

            <button>Показать еще</button>
        </div>
    )
}