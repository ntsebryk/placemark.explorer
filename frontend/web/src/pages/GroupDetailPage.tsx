import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { groupsApi } from "../api/groups";
import { placesApi } from "../api/places";
import { InlineNotice, Loading, PageTitle } from "../components/Ui";
import { errorMessage } from "../lib/errors";
import { PlaceGroupResponse, PlaceResponse } from "../lib/types";

function formatIso(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

export function GroupDetailPage(): JSX.Element {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState<PlaceGroupResponse | null>(null);
  const [places, setPlaces] = useState<PlaceResponse[]>([]);
  const [placeId, setPlaceId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load(): Promise<void> {
      setLoading(true);
      setError("");
      try {
        const [groupResult, placesResult] = await Promise.all([groupsApi.getById(id), placesApi.list({ page: 0, size: 100 })]);
        if (!cancelled) {
          setGroup(groupResult);
          setPlaces(placesResult.content);
        }
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

  async function refreshGroup(): Promise<void> {
    try {
      const nextGroup = await groupsApi.getById(id);
      setGroup(nextGroup);
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  async function onAddPlace(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    if (!placeId.trim()) {
      setError("Place ID is required.");
      return;
    }
    setError("");
    try {
      const nextGroup = await groupsApi.addPlace(id, placeId.trim());
      setGroup(nextGroup);
      setPlaceId("");
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  async function onRemovePlace(itemPlaceId: string): Promise<void> {
    try {
      const nextGroup = await groupsApi.removePlace(id, itemPlaceId);
      setGroup(nextGroup);
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  async function onDeleteGroup(): Promise<void> {
    if (!confirm("Delete this group?")) {
      return;
    }
    try {
      await groupsApi.remove(id);
      await navigate("/groups");
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  return (
    <div>
      <PageTitle
        title="Group Detail"
        subtitle="Inspect and manage group membership."
        action={
          <Link className="button ghost" to="/groups">
            Back to Groups
          </Link>
        }
      />
      {error ? <InlineNotice type="error">{error}</InlineNotice> : null}
      {loading ? <Loading /> : null}
      {!loading && group ? (
        <section className="card detail-grid">
          <p>
            <strong>ID:</strong> {group.id}
          </p>
          <p>
            <strong>Name:</strong> {group.name}
          </p>
          <p>
            <strong>Description:</strong> {group.description || "-"}
          </p>
          <p>
            <strong>Created:</strong> {formatIso(group.createdAt)}
          </p>
          <p>
            <strong>Updated:</strong> {formatIso(group.updatedAt)}
          </p>
          <div>
            <button className="button danger" type="button" onClick={() => void onDeleteGroup()}>
              Delete Group
            </button>
          </div>
        </section>
      ) : null}

      {!loading && group ? (
        <section className="card">
          <h3>Manage Membership</h3>
          <form className="inline-form" onSubmit={(e) => void onAddPlace(e)}>
            <label className="field">
              <span>Place</span>
              <select value={placeId} onChange={(e) => setPlaceId(e.target.value)}>
                <option value="">Choose place</option>
                {places.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} ({item.id})
                  </option>
                ))}
              </select>
            </label>
            <span className="or-divider">or</span>
            <label className="field">
              <span>Place ID</span>
              <input value={placeId} onChange={(e) => setPlaceId(e.target.value)} placeholder="UUID" />
            </label>
            <button className="button" type="submit">
              Add to Group
            </button>
          </form>

          <h4>Current Place IDs</h4>
          {group.placeIds.length === 0 ? (
            <InlineNotice type="info">No places linked to this group.</InlineNotice>
          ) : (
            <ul className="id-list">
              {group.placeIds.map((place) => (
                <li key={place}>
                  <span>{place}</span>
                  <button className="button danger" type="button" onClick={() => void onRemovePlace(place)}>
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
          <button className="button ghost" type="button" onClick={() => void refreshGroup()}>
            Refresh
          </button>
        </section>
      ) : null}
    </div>
  );
}
