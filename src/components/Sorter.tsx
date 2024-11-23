import { useSearchParams } from "react-router-dom";
import { InputChangeEvent } from "../shared.types";

export default function Sorter() {
  const [searchParams, setSearchParams] = useSearchParams();

  const sortBy = searchParams.get("sortBy");

  function handleSorting(e: InputChangeEvent) {
    searchParams.set("sortBy", e.target.value);
    setSearchParams(searchParams);
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
