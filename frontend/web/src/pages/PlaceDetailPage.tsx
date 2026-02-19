import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { placesApi } from "../api/places";
import { InlineNotice, Loading, PageTitle } from "../components/Ui";
import { errorMessage } from "../lib/errors";
import { PlaceResponse } from "../lib/types";

function formatIso(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

export function PlaceDetailPage(): JSX.Element {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const [place, setPlace] = useState<PlaceResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load(): Promise<void> {
      setLoading(true);
      setError("");
      try {
        const item = await placesApi.getById(id);
        if (!cancelled) setPlace(item);
      } catch (err) {
        if (!cancelled) setError(errorMessage(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  async function onDelete(): Promise<void> {
    if (!confirm("Delete this place?")) {
      return;
    }
    try {
      await placesApi.remove(id);
      await navigate("/places");
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  return (
    <div>
      <PageTitle
        title="Place Detail"
        subtitle="Inspect one place record."
        action={
          <Link className="button ghost" to="/places">
            Back to Places
          </Link>
        }
      />
      {error ? <InlineNotice type="error">{error}</InlineNotice> : null}
      {loading ? <Loading /> : null}
      {!loading && place ? (
        <section className="card detail-grid">
          <p>
            <strong>ID:</strong> {place.id}
          </p>
          <p>
            <strong>Name:</strong> {place.name}
          </p>
          <p>
            <strong>Description:</strong> {place.description || "-"}
          </p>
          <p>
            <strong>Category:</strong> {place.category}
          </p>
          <p>
            <strong>Coordinates:</strong> {place.latitude}, {place.longitude}
          </p>
          <p>
            <strong>Visit Radius:</strong> {place.visitRadiusMeters} m
          </p>
          <p>
            <strong>Group IDs:</strong> {place.groupIds.length ? place.groupIds.join(", ") : "-"}
          </p>
          <p>
            <strong>Created:</strong> {formatIso(place.createdAt)}
          </p>
          <p>
            <strong>Updated:</strong> {formatIso(place.updatedAt)}
          </p>
          <div>
            <button className="button danger" type="button" onClick={() => void onDelete()}>
              Delete Place
            </button>
          </div>
        </section>
      ) : null}
    </div>
  );
}
