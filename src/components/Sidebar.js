import { useState, useEffect } from "react";

export default function Sidebar({ children }) {
    return (
        <div className="sidebar app__sidebar">
            <form onSubmit={(e) => e.preventDefault}>
                {children}
            </form>
        </div>
    )
}

export function Sorter({ sortBy, onSortBy }) {
    function handleSorting(e) {
        onSortBy(e.target.value);
    }
    return (
        <>
            <p className="sidebar__caption">Сортировать</p>
            <div>
                <input id="price-increase" type="radio" name="sorting" value={"price-increase"} checked={sortBy === "price-increase"} onChange={handleSorting} />
                <label htmlFor="radio1"> - по возрастанию цены</label>
            </div>
            <div>
                <input id="price-decrease" type="radio" name="sorting" value={"price-decrease"} checked={sortBy === "price-decrease"} onChange={handleSorting} />
                <label htmlFor="radio2"> - по убыванию цены</label>
            </div>
            <div>
                <input id="travel-duration" type="radio" name="sorting" value={"travel-duration"} checked={sortBy === "travel-duration"} onChange={handleSorting} />
                <label htmlFor="radio3"> - по времени в пути</label>
            </div>
        </>
    )
}

export function Filter({ filterBy, onFilterBy }) {
    function handleFilter(e) {
        filterBy === e.target.value ? onFilterBy("") : onFilterBy(e.target.value);
    }

    return (
        <div>
            <p className="sidebar__caption">Фильтровать</p>
            <div>
                <input id="checkbox1" type="checkbox" name="transfer-filter" value="single-transfer" checked={filterBy === "single-transfer"} onChange={handleFilter} />
                <label htmlFor="checkbox1"> - 1 пересадка</label>
            </div>
            <div>
                <input id="no-transfer" type="checkbox" name="transfer-filter" value="no-transfer" checked={filterBy === "no-transfer"} onChange={handleFilter} />
                <label htmlFor="no-transfer"> - без пересадок</label>
            </div>
        </div>
    )
}

export function PriceRange({ minPriceRange, maxPriceRange, onMinPriceRange, onMaxPriceRange, highestPrice, lowestPrice }) {


    function handleMinPriceRange(e) {
        const val = parseInt(e.target.value);
        if (isNaN(val)) onMinPriceRange("");

        else onMinPriceRange(val);
    }

    function handleMaxPriceRange(e) {
        const val = parseInt(e.target.value);
        if (isNaN(val)) onMaxPriceRange("");

        else onMaxPriceRange(val);
    }

    return (
        <div>
            <p className="sidebar__caption">Цена</p>
            <div>
                <label htmlFor="min-price">От</label>
                <input id="min-price" type="text" value={minPriceRange} onChange={handleMinPriceRange} placeholder={lowestPrice} />
            </div>
            <div>
                <label htmlFor="max-price">До</label>
                <input id="max-price" type="text" value={maxPriceRange} onChange={handleMaxPriceRange} placeholder={highestPrice} />
            </div>
        </div>
    )
}

export function PickAirlines({ minPriceRange, maxPriceRange, filteredFlights, bestPricesArr, filterBy, flightsDataLoading, errorLoadingData, pickedAirlines, onPickedAirlines }) {
    const [uniqueAirlinesArr, setUniqueAirlinesArr] = useState([]);
    const [airlinesBestPrices, setAirlinesBestPrices] = useState([]);

    function handlePickAirline(e) {
        const airline = e.target.value;
        if (pickedAirlines.includes(airline)) {
            onPickedAirlines(cur => cur.filter((item) => item !== airline))
        };

        if (!pickedAirlines.includes(airline)) {
            onPickedAirlines(cur => [...cur, airline])
        }
    }

    useEffect(function updateUniqueAirlinesArr() {
        setUniqueAirlinesArr([...new Set(filteredFlights
            .map((flight) => flight?.flight?.carrier.caption))]
            .sort((a, b) => a.localeCompare(b)));
    }, [filteredFlights, setUniqueAirlinesArr])

    useEffect(function updateAirlinesBestPrices() {

        function getAirlinesBestPrices(transfer) {

            return uniqueAirlinesArr.map((airline) => {
                const relevantBestFlights = bestPricesArr[transfer]?.bestFlights
                    .filter((filteredFlight) => filteredFlight?.carrier?.caption === airline);

                if (relevantBestFlights.length > 0) {
                    const currency = relevantBestFlights[0]?.price?.currency;
                    const price = relevantBestFlights.reduce((minPrice, flight) => {
                        const curPrice = parseInt(flight?.price?.amount);
                        return (Math.min(minPrice, curPrice))

                    }, relevantBestFlights[0]?.price?.amount)
                    return `${Number(price)} ${currency}`;
                }
                return null;
            })
        }

        if (filterBy === "single-transfer") {
            setAirlinesBestPrices(() => getAirlinesBestPrices("ONE_CONNECTION"));
        }

        if (filterBy === "no-transfer") {
            setAirlinesBestPrices(() => getAirlinesBestPrices("DIRECT"));
        }

        if (!filterBy) {
            const single = getAirlinesBestPrices("ONE_CONNECTION");
            const direct = getAirlinesBestPrices("DIRECT");
            setAirlinesBestPrices([...new Set([...single, ...direct])]);
        }

    }, [filteredFlights, filterBy, bestPricesArr, setAirlinesBestPrices, uniqueAirlinesArr])

    return (
        <>
            <p className="sidebar__caption">Авиакомпании</p>
            {flightsDataLoading && !errorLoadingData && <p className="message--sidebar">Данные загружаются...</p>}
            {errorLoadingData && <p>{errorLoadingData}</p>}
            {!flightsDataLoading && uniqueAirlinesArr.length === 0 && !errorLoadingData && (<p className="message--sidebar">Нет совпадений</p>)}
            {!flightsDataLoading && uniqueAirlinesArr.length > 0 && !errorLoadingData && (
                <div>
                    {uniqueAirlinesArr.map((airline, i) => (
                        <div key={airline} >
                            <input id={`checkbox${i}`} type="checkbox" name="airlines" value={airline} checked={pickedAirlines.includes(airline)} onChange={handlePickAirline} />
                            <label htmlFor={`checkbox${i}`}>{airline}</label>
                            <span>{` от ${airlinesBestPrices[i]}`}</span>
                        </div>
                    ))}
                </div>
            )
            }
        </>
    );
}