import { InputChangeEvent } from "../shared.types";

interface FilterProps {
  filterBy: string;
  onFilterBy: React.Dispatch<React.SetStateAction<string>>;
}

export default function Filter({ filterBy, onFilterBy }: FilterProps) {
  function handleFilter(e: InputChangeEvent) {
    filterBy === e.target.value ? onFilterBy("") : onFilterBy(e.target.value);
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
