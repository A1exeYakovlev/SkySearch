import { InputChangeEvent } from "../shared.types";

interface PriceRangeProps {
  minPriceRange: number | null;
  maxPriceRange: number | null;
  onMinPriceRange: React.Dispatch<React.SetStateAction<number | null>>;
  onMaxPriceRange: React.Dispatch<React.SetStateAction<number | null>>;
  highestPrice: number | null;
  lowestPrice: number;
}

export default function PriceRange({
  minPriceRange,
  maxPriceRange,
  onMinPriceRange,
  onMaxPriceRange,
  highestPrice,
  lowestPrice,
}: PriceRangeProps) {
  function handleMinPriceRange(e: InputChangeEvent) {
    const val = parseInt(e.target.value);
    if (isNaN(val)) onMinPriceRange(null);
    else onMinPriceRange(val);
  }

  function handleMaxPriceRange(e: InputChangeEvent) {
    const val = parseInt(e.target.value);
    if (isNaN(val)) onMaxPriceRange(null);
    else onMaxPriceRange(val);
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
