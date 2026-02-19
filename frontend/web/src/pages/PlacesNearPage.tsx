import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { placesApi } from "../api/places";
import { InlineNotice, PageTitle } from "../components/Ui";
import { errorMessage } from "../lib/errors";
import { PLACE_CATEGORIES, PageableResponse, PlaceCategory, PlaceResponse } from "../lib/types";

interface NearForm {
  lat: string;
  lon: string;
  radiusMeters: string;
  category: PlaceCategory | "";
}

export function PlacesNearPage(): JSX.Element {
  const [form, setForm] = useState<NearForm>({
    lat: "",
    lon: "",
    radiusMeters: "500",
    category: ""
  });
  const [data, setData] = useState<PageableResponse<PlaceResponse> | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function validate(): string | null {
    const lat = Number(form.lat);
    const lon = Number(form.lon);
    const radius = Number(form.radiusMeters);

    if (Number.isNaN(lat) || lat < -90 || lat > 90) return "Latitude must be between -90 and 90.";
    if (Number.isNaN(lon) || lon < -180 || lon > 180) return "Longitude must be between -180 and 180.";
    if (!Number.isInteger(radius) || radius <= 0) return "Radius must be a positive integer.";
    return null;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setLoading(true);
    try {
      const result = await placesApi.near({
        lat: Number(form.lat),
        lon: Number(form.lon),
        radiusMeters: Number(form.radiusMeters),
        category: form.category || undefined,
        page: 0,
        size: 20
      });
      setData(result);
    } catch (err) {
      setError(errorMessage(err));
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageTitle title="Near Search" subtitle="Find places around a point." />
      <form className="card form-grid near-form" onSubmit={(e) => void onSubmit(e)}>
        <label className="field">
          <span>Latitude</span>
          <input
            type="number"
            step="any"
            value={form.lat}
            onChange={(e) => setForm({ ...form, lat: e.target.value })}
            required
          />
        </label>
        <label className="field">
          <span>Longitude</span>
          <input
            type="number"
            step="any"
            value={form.lon}
            onChange={(e) => setForm({ ...form, lon: e.target.value })}
            required
          />
        </label>
        <label className="field">
          <span>Radius (meters)</span>
          <input
            type="number"
            step={1}
            value={form.radiusMeters}
            onChange={(e) => setForm({ ...form, radiusMeters: e.target.value })}
            required
          />
        </label>
        <label className="field">
          <span>Category</span>
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as PlaceCategory | "" })}>
            <option value="">All</option>
            {PLACE_CATEGORIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <div>
          <button className="button" type="submit" disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </form>
      {error ? <InlineNotice type="error">{error}</InlineNotice> : null}
      {data?.content.length === 0 ? <InlineNotice type="info">No places found for this query.</InlineNotice> : null}
      {data?.content.length ? (
        <section className="card">
          <div className="table-meta">
            <p>{data.totalElements} matches</p>
            <p>Search radius: {form.radiusMeters} m</p>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Coordinates</th>
                <th>Radius</th>
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
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ) : null}
    </div>
  );
}
