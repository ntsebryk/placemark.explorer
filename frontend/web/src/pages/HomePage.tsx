import { Link } from "react-router-dom";
import { PageTitle } from "../components/Ui";

export function HomePage(): JSX.Element {
  return (
    <div>
      <PageTitle title="Operator Dashboard" subtitle="A calm, minimal workspace for place operations." />
      <section className="hero card">
        <div>
          <p className="eyebrow">Today</p>
          <h3>Manage places, groups, and geo lookup in one flow.</h3>
          <p>Use structured catalog pages now, then attach map interactions on the reserved route.</p>
          <div className="hero-actions">
            <Link className="button" to="/places/new">
              New Place
            </Link>
            <Link className="button ghost" to="/groups/new">
              New Group
            </Link>
          </div>
        </div>
        <div className="hero-stat">
          <span>Workspace Mode</span>
          <strong>Minimal Catalog</strong>
          <small>Map integration planned next.</small>
        </div>
      </section>
      <section className="card-grid">
        <Link className="tile" to="/places">
          <h3>Places</h3>
          <p>List, inspect, create, and delete places.</p>
        </Link>
        <Link className="tile" to="/places/near">
          <h3>Near Search</h3>
          <p>Run radius search by coordinates and category.</p>
        </Link>
        <Link className="tile" to="/groups">
          <h3>Groups</h3>
          <p>Create groups and manage place membership.</p>
        </Link>
        <Link className="tile" to="/map">
          <h3>Map Placeholder</h3>
          <p>Reserved route for upcoming map integration.</p>
        </Link>
      </section>
    </div>
  );
}
