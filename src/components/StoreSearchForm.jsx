import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function StoreSearchForm() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  function submitSearch(event) {
    event.preventDefault();
    navigate(`/productos?q=${encodeURIComponent(search.trim())}`);
  }

  return (
    <form className="d-flex gap-2 flex-grow-1 flex-lg-grow-0" onSubmit={submitSearch} role="search">
      <label className="visually-hidden" htmlFor="store-search">Buscar productos</label>
      <input
        className="form-control form-control-sm"
        id="store-search"
        type="search"
        placeholder="Buscar"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />
      <button className="btn btn-outline-primary btn-sm" type="submit">Buscar</button>
    </form>
  );
}
