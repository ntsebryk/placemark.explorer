import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { groupsApi } from "../api/groups";
import { InlineNotice, Loading, PageTitle } from "../components/Ui";
import { errorMessage } from "../lib/errors";
import { PageableResponse, PlaceGroupResponse } from "../lib/types";

const PAGE_SIZE = 20;

export function GroupsListPage(): JSX.Element {
  const [page, setPage] = useState(0);
  const [data, setData] = useState<PageableResponse<PlaceGroupResponse> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load(): Promise<void> {
      setLoading(true);
      setError("");
      try {
        const result = await groupsApi.list({ page, size: PAGE_SIZE });
        if (!cancelled) setData(result);
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
  }, [page]);

  async function onDelete(groupId: string): Promise<void> {
    if (!confirm("Delete this group?")) {
      return;
    }
    try {
      await groupsApi.remove(groupId);
      const updated = await groupsApi.list({ page, size: PAGE_SIZE });
      setData(updated);
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  return (
    <div>
      <PageTitle
        title="Groups"
        subtitle="Manage place collections."
        action={
          <Link className="button" to="/groups/new">
            New Group
          </Link>
        }
      />
      {error ? <InlineNotice type="error">{error}</InlineNotice> : null}
      {loading ? <Loading /> : null}
      {!loading && data?.content.length === 0 ? <InlineNotice type="info">No groups found.</InlineNotice> : null}
      {!loading && data?.content.length ? (
        <section className="card">
          <div className="table-meta">
            <p>{data.totalElements} groups total</p>
            <p>
              Page {data.number + 1} / {Math.max(1, data.totalPages)}
            </p>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Place Count</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.content.map((group) => (
                <tr key={group.id}>
                  <td>
                    <Link to={`/groups/${group.id}`}>{group.name}</Link>
                  </td>
                  <td>{group.description || "-"}</td>
                  <td>{group.placeIds.length}</td>
                  <td>
                    <button className="button danger" type="button" onClick={() => void onDelete(group.id)}>
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
