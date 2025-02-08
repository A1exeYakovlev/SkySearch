import { useSearchParams } from "react-router-dom";
import { InputChangeEvent } from "../shared.types";
import { useFilteredFlights } from "../hooks/useFilteredFlights";

export default function PriceRange() {
  const { lowestPrice, highestPrice } = useFilteredFlights() || {};
  const [searchParams, setSearchParams] = useSearchParams();

  const maxPriceRange = searchParams.get("maxPrice");
  const minPriceRange = searchParams.get("minPrice");

  function handlePriceRange(
    e: InputChangeEvent,
    limit: "maxPrice" | "minPrice"
  ) {
    const val = parseInt(e.target.value);

    if (isNaN(val) || val === 0) {
      searchParams.delete(limit);
    } else {
      searchParams.set(limit, val.toString());
    }

    setSearchParams(searchParams);
  }

  function handleMinPriceRange(e: InputChangeEvent) {
    handlePriceRange(e, "minPrice");
  }

  function handleMaxPriceRange(e: InputChangeEvent) {
    handlePriceRange(e, "maxPrice");
  }

  return (
    <div className="sidebar__wrap">
      <p className="sidebar__caption">Цена</p>
      <div className="sidebar__input-row ">
        <label className="sidebar__label" htmlFor="min-price">
          От
        </label>
        <input
          className="sidebar__input-min-price"
          id="min-price"
          type="text"
          value={minPriceRange || ""}
          onChange={handleMinPriceRange}
          placeholder={lowestPrice ? lowestPrice.toString() : ""}
        />
      </div>
      <div className="sidebar__input-row">
        <label className="sidebar__label" htmlFor="max-price">
          До
        </label>
        <input
          className="sidebar__input-max-price"
          id="max-price"
          type="text"
          value={maxPriceRange || ""}
          onChange={handleMaxPriceRange}
          placeholder={highestPrice ? highestPrice.toString() : ""}
        />
      </div>
    </div>
  );
}
