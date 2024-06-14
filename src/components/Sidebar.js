import { useState, useEffect } from "react";

export default function Sidebar({ children }) {
    return (
        <div className="app__sidebar">
            <form className="sidebar__form" onSubmit={(e) => e.preventDefault}>
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
        <div className="sidebar__wrap">
            <p className="sidebar__caption">Сортировать</p>
            <div className="sidebar__input-row">
                <input id="price-increase" type="radio" name="sorting" value={"price-increase"} checked={sortBy === "price-increase"} onChange={handleSorting} />
                <label className="sidebar__label" htmlFor="radio1"> - по возрастанию цены</label>
            </div>
            <div className="sidebar__input-row">
                <input id="price-decrease" type="radio" name="sorting" value={"price-decrease"} checked={sortBy === "price-decrease"} onChange={handleSorting} />
                <label className="sidebar__label" htmlFor="radio2"> - по убыванию цены</label>
            </div>
            <div className="sidebar__input-row">
                <input id="travel-duration" type="radio" name="sorting" value={"travel-duration"} checked={sortBy === "travel-duration"} onChange={handleSorting} />
                <label className="sidebar__label" htmlFor="radio3"> - по времени в пути</label>
            </div>
        </div>
    )
}

export function Filter({ filterBy, onFilterBy }) {
    function handleFilter(e) {
        filterBy === e.target.value ? onFilterBy("") : onFilterBy(e.target.value);
    }

    return (
        <div className="sidebar__wrap">
            <p className="sidebar__caption">Фильтровать</p>
            <div className="sidebar__input-row">
                <input id="single-transfer" type="checkbox" name="transfer-filter" value="single-transfer" checked={filterBy === "single-transfer"} onChange={handleFilter} />
                <label className="sidebar__label" htmlFor="single-transfer"> - 1 пересадка</label>
            </div>
            <div className="sidebar__input-row">
                <input id="no-transfer" type="checkbox" name="transfer-filter" value="no-transfer" checked={filterBy === "no-transfer"} onChange={handleFilter} />
                <label className="sidebar__label" htmlFor="no-transfer"> - без пересадок</label>
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
        <div className="sidebar__wrap">
            <p className="sidebar__caption">Цена</p>
            <div className="sidebar__input-row ">
                <label className="sidebar__label" htmlFor="min-price">От</label>
                <input className="sidebar__input-min-price" id="min-price" type="text" value={minPriceRange} onChange={handleMinPriceRange} placeholder={lowestPrice} />
            </div>
            <div className="sidebar__input-row">
                <label className="sidebar__label" htmlFor="max-price">До</label>
                <input className="sidebar__input-max-price" id="max-price" type="text" value={maxPriceRange} onChange={handleMaxPriceRange} placeholder={highestPrice} />
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
        <div className="sidebar__wrap">
            <p className="sidebar__caption">Авиакомпании</p>
            {flightsDataLoading && !errorLoadingData && <p className="sidebar__message">Данные загружаются...</p>}
            {errorLoadingData && <p>{errorLoadingData}</p>}
            {!flightsDataLoading && uniqueAirlinesArr.length === 0 && !errorLoadingData && (<p className="message--sidebar">Нет совпадений</p>)}
            {!flightsDataLoading && uniqueAirlinesArr.length > 0 && !errorLoadingData && (
                <div>
                    {uniqueAirlinesArr.map((airline, i) => (
                        <div className="sidebar__input-row" key={airline} >
                            <input id={`airlines-checkbox${i}`} type="checkbox" name="airlines" value={airline} checked={pickedAirlines.includes(airline)} onChange={handlePickAirline} />
                            <label className="sidebar__label" htmlFor={`airlines-checkbox${i}`}>{` - ${airline}`}</label>
                            <span className="sidebar__label-price">{` от ${airlinesBestPrices[i]}`}</span>
                        </div>
                    ))}
                </div>
            )
            }
        </div>
    );
}