import { useEffect, useState } from "react";

export default function Sidebar({ children }) {
    return (
        <div className="sidebar app__sidebar">
            <form>
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
        onFilterBy(e.target.value);
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

export function PriceRange({ minPriceRange, maxPriceRange, onMinPriceRange, onMaxPriceRange }) {


    function handleMinPriceRange(e) {
        const val = parseInt(e.target.value);
        if (!isNaN(val)) onMinPriceRange(val);
    }

    function handleMaxPriceRange(e) {
        const val = parseInt(e.target.value);
        if (!isNaN(val)) onMaxPriceRange(val);
    }

    return (
        <div>
            <p className="sidebar__caption">Цена</p>
            <div>
                <label htmlFor="min-price">От</label>
                <input id="min-price" type="text" value={minPriceRange} onChange={handleMinPriceRange} />
            </div>
            <div>
                <label htmlFor="max-price">До</label>
                <input id="max-price" type="text" value={maxPriceRange} onChange={handleMaxPriceRange} />
            </div>
        </div>
    )
}

export function PickAirlines({ flightsData }) {
    let bestPricesArr;

    if (flightsData) {
        const { result: { bestPrices } } = flightsData;
        bestPricesArr = bestPrices;
        // console.log(bestPricesArr)
    }
    return (
        <>
            <div>
                <input type="checkbox" />
                <label htmlFor="checkbox1">Air France</label>
            </div>
        </>
    )
}