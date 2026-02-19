import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { placesApi } from "../api/places";
import { InlineNotice, PageTitle } from "../components/Ui";
import { errorMessage } from "../lib/errors";
import { PLACE_CATEGORIES, PlaceCategory } from "../lib/types";

interface FormState {
  name: string;
  description: string;
  category: PlaceCategory;
  latitude: string;
  longitude: string;
  visitRadiusMeters: string;
}

const defaultState: FormState = {
  name: "",
  description: "",
  category: "LANDMARK",
  latitude: "",
  longitude: "",
  visitRadiusMeters: "50"
};

export function PlaceCreatePage(): JSX.Element {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>(defaultState);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function validate(): string | null {
    const lat = Number(form.latitude);
    const lon = Number(form.longitude);
    const radius = Number(form.visitRadiusMeters);

    if (!form.name.trim()) return "Name is required.";
    if (form.name.trim().length > 200) return "Name must be at most 200 characters.";
    if (form.description.length > 4000) return "Description must be at most 4000 characters.";
    if (Number.isNaN(lat) || lat < -90 || lat > 90) return "Latitude must be between -90 and 90.";
    if (Number.isNaN(lon) || lon < -180 || lon > 180) return "Longitude must be between -180 and 180.";
    if (!Number.isInteger(radius) || radius <= 0) return "Visit radius must be a positive integer.";
    return null;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      const created = await placesApi.create({
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        category: form.category,
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
        visitRadiusMeters: Number(form.visitRadiusMeters)
      });
      await navigate(`/places/${created.id}`);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <PageTitle title="Create Place" subtitle="Capture place metadata and geolocation." />
      {error ? <InlineNotice type="error">{error}</InlineNotice> : null}
      <form className="card form-grid" onSubmit={(e) => void onSubmit(e)}>
        <label className="field">
          <span>Name</span>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required maxLength={200} />
        </label>
        <label className="field">
          <span>Description</span>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            maxLength={4000}
          />
        </label>
        <label className="field">
          <span>Category</span>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value as PlaceCategory })}
            required
          >
            {PLACE_CATEGORIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Latitude</span>
          <input
            type="number"
            step="any"
            min={-90}
            max={90}
            value={form.latitude}
            onChange={(e) => setForm({ ...form, latitude: e.target.value })}
            required
          />
        </label>
        <label className="field">
          <span>Longitude</span>
          <input
            type="number"
            step="any"
            min={-180}
            max={180}
            value={form.longitude}
            onChange={(e) => setForm({ ...form, longitude: e.target.value })}
            required
          />
        </label>
        <label className="field">
          <span>Visit Radius (meters)</span>
          <input
            type="number"
            step={1}
            min={1}
            value={form.visitRadiusMeters}
            onChange={(e) => setForm({ ...form, visitRadiusMeters: e.target.value })}
            required
          />
        </label>
        <div>
          <button className="button" type="submit" disabled={submitting}>
            {submitting ? "Creating..." : "Create Place"}
          </button>
        </div>
      </form>
    </div>
  );
}
