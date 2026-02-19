import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { placesApi } from "../api/places";
import { InlineNotice, Loading, PageTitle } from "../components/Ui";
import { errorMessage } from "../lib/errors";
import { PLACE_CATEGORIES, PageableResponse, PlaceCategory, PlaceResponse } from "../lib/types";

const PAGE_SIZE = 20;

export function PlacesListPage(): JSX.Element {
  const [category, setCategory] = useState<PlaceCategory | "">("");
  const [page, setPage] = useState(0);
  const [data, setData] = useState<PageableResponse<PlaceResponse> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load(): Promise<void> {
      setLoading(true);
      setError("");
      try {
        const result = await placesApi.list({ page, size: PAGE_SIZE, category: category || undefined });
        if (!cancelled) {
          setData(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(errorMessage(err));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [page, category]);

  async function onDelete(placeId: string): Promise<void> {
    if (!confirm("Delete this place?")) {
      return;
    }
    try {
      await placesApi.remove(placeId);
      const updated = await placesApi.list({ page, size: PAGE_SIZE, category: category || undefined });
      setData(updated);
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  return (
    <div>
      <PageTitle
        title="Places"
        subtitle="Catalog places and run category filtering."
        action={
          <Link className="button" to="/places/new">
            New Place
          </Link>
        }
      />
      <section className="card toolbar">
        <div>
          <p className="eyebrow">Filter by category</p>
          <div className="chip-set">
            <button
              type="button"
              className={category === "" ? "filter-chip active" : "filter-chip"}
              onClick={() => setCategory("")}
            >
              All
            </button>
            {PLACE_CATEGORIES.map((item) => (
              <button
                type="button"
                key={item}
                className={category === item ? "filter-chip active" : "filter-chip"}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <label className="field compact">
          <span>Fallback Select</span>
          <select value={category} onChange={(e) => setCategory(e.target.value as PlaceCategory | "")}>
            <option value="">All</option>
            {PLACE_CATEGORIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
      </section>
      {error ? <InlineNotice type="error">{error}</InlineNotice> : null}
      {loading ? <Loading /> : null}
      {!loading && data?.content.length === 0 ? <InlineNotice type="info">No places found.</InlineNotice> : null}
      {!loading && data?.content.length ? (
        <section className="card">
          <div className="table-meta">
            <p>{data.totalElements} places total</p>
            <p>
              Page {data.number + 1} / {Math.max(1, data.totalPages)}
            </p>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Coordinates</th>
                <th>Radius</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.content.map((place) => (
                <tr key={place.id}>
                  <td>
                    <Link to={`/places/${place.id}`}>{place.name}</Link>
                  </td>
                  <td>{place.category}</td>
                  <td>
                    {place.latitude}, {place.longitude}
                  </td>
                  <td>{place.visitRadiusMeters} m</td>
                  <td>
                    <button className="button danger" type="button" onClick={() => void onDelete(place.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pager">
            <button type="button" onClick={() => setPage((v) => Math.max(0, v - 1))} disabled={data.first}>
              Previous
            </button>
            <span>
              Page {data.number + 1} / {Math.max(1, data.totalPages)}
            </span>
            <button type="button" onClick={() => setPage((v) => v + 1)} disabled={data.last}>
              Next
            </button>
          </div>
        </section>
      ) : null}
    </div>
  );
}
