import { useSearchParams } from "react-router-dom";
import { InputChangeEvent } from "../shared.types";

export default function Filter() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filterBy = searchParams.get("filterBy");

  function handleFilter(e: InputChangeEvent) {
    if (filterBy === e.target.value) {
      searchParams.delete("filterBy");
    } else {
      searchParams.set("filterBy", e.target.value);
    }

    setSearchParams(searchParams);
  }

  return (
    <div className="sidebar__wrap">
      <p className="sidebar__caption">Фильтровать</p>
      <div className="sidebar__input-row">
        <input
          id="single-transfer"
          type="checkbox"
          name="transfer-filter"
          value="single-transfer"
          checked={filterBy === "single-transfer"}
          onChange={handleFilter}
        />
        <label className="sidebar__label" htmlFor="single-transfer">
          {" "}
          - 1 пересадка
        </label>
      </div>
      <div className="sidebar__input-row">
        <input
          id="no-transfer"
          type="checkbox"
          name="transfer-filter"
          value="no-transfer"
          checked={filterBy === "no-transfer"}
          onChange={handleFilter}
        />
        <label className="sidebar__label" htmlFor="no-transfer">
          {" "}
          - без пересадок
        </label>
      </div>
    </div>
  );
}
