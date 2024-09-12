import { InputChangeEvent } from "../shared.types";

interface SorterProps {
  sortBy: string;
  onSortBy: React.Dispatch<React.SetStateAction<string>>;
}

export default function Sorter({ sortBy, onSortBy }: SorterProps) {
  function handleSorting(e: InputChangeEvent) {
    onSortBy(e.target.value);
  }
  return (
    <div className="sidebar__wrap">
      <p className="sidebar__caption">Сортировать</p>
      <div className="sidebar__input-row">
        <input
          id="price-increase"
          type="radio"
          name="sorting"
          value={"price-increase"}
          checked={sortBy === "price-increase"}
          onChange={handleSorting}
        />
        <label className="sidebar__label" htmlFor="radio1">
          {" "}
          - по возрастанию цены
        </label>
      </div>
      <div className="sidebar__input-row">
        <input
          id="price-decrease"
          type="radio"
          name="sorting"
          value={"price-decrease"}
          checked={sortBy === "price-decrease"}
          onChange={handleSorting}
        />
        <label className="sidebar__label" htmlFor="radio2">
          {" "}
          - по убыванию цены
        </label>
      </div>
      <div className="sidebar__input-row">
        <input
          id="travel-duration"
          type="radio"
          name="sorting"
          value={"travel-duration"}
          checked={sortBy === "travel-duration"}
          onChange={handleSorting}
        />
        <label className="sidebar__label" htmlFor="radio3">
          {" "}
          - по времени в пути
        </label>
      </div>
    </div>
  );
}
