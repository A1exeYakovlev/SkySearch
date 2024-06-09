import { useEffect, useState } from "react"

export default function FlightList() {
    function Flight() {
        return (
            <div className="app__flightlist">
                <FlightLeg></FlightLeg>
                <FlightLeg></FlightLeg>
            </div>
        )


    }

    function FlightLeg() {
        const [flightsData, setFlightsData] = useState(null);
        const [flightsDataLoading, setFlightsDataLoading] = useState(false);
        const [errorLoadingData, setErrorLoadingData] = useState("");

        let flightsArr, bestPricesArr;
        let departureCity;
        let departureAirport;
        let arrivalCity;
        let arrivalAirport;
        let arrivalDate = {};
        let departureDate = {};
        let airline;
        let travelDuration = {};
        let transferCount;


        if (flightsData?.result) {
            const { result: { flights, bestPrices } } = flightsData;
            flightsArr = flights;
            bestPricesArr = bestPrices;
            const { airline: arln, departureAirport: departAir, departureCity: departCity, departureDate: departDate } = flightsArr[0]?.flight?.legs[0]?.segments[0];
            const { arrivalAirport: arrivAir, arrivalCity: arrivCity, arrivalDate: arrivDate } = flightsArr[0]?.flight?.legs[0]?.segments.at(-1);
            const duration = flightsArr[0]?.flight?.legs[0]?.segments.reduce((total, cur) => total + cur.travelDuration, 0);
            departureCity = departCity;
            departureAirport = departAir;
            arrivalCity = arrivCity;
            arrivalAirport = arrivAir;
            airline = arln;
            travelDuration.hours = Math.floor(duration / 60);
            travelDuration.minutes = duration % 60;
            transferCount = flightsArr[0]?.flight?.legs[0]?.segments.length - 1;

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


        useEffect(function () {

            async function importData() {
                try {
                    setFlightsDataLoading(true);
                    setErrorLoadingData("");

                    const data = (await import("../flights.json")).default

                    if (!data) throw new Error("Ошибка в загрузке данных");
                    setFlightsData(data);
                    console.log(data)
                } catch (err) {
                    console.error(err);
                    setErrorLoadingData(err.message)
                } finally { setFlightsDataLoading(false) }
            }
            importData();
        }, [setFlightsData, setFlightsDataLoading, setErrorLoadingData])

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
                        <button>Выбрать</button>
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