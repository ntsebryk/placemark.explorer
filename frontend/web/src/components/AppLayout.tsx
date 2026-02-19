import { Link, NavLink, Outlet } from "react-router-dom";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/places", label: "Places" },
  { to: "/places/near", label: "Near Search" },
  { to: "/groups", label: "Groups" },
  { to: "/map", label: "Map" }
];

export function AppLayout(): JSX.Element {
  return (
    <div className="app-shell">
      <aside className="side-rail">
        <div className="brand">
          <p className="eyebrow">placemark.explorer</p>
          <h1>Atlas Desk</h1>
          <p>Minimal operator workspace for places and groups.</p>
        </div>
        <nav className="nav-row" aria-label="Primary">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="rail-footer">
          <p>Inspired by travel list-detail patterns.</p>
          <div className="rail-actions">
            <Link className="button ghost" to="/places/new">
              Add Place
            </Link>
            <Link className="button ghost" to="/groups/new">
              Add Group
            </Link>
          </div>
        </div>
      </aside>
      <section className="workspace">
        <header className="workspace-header">
          <p>Catalog Workspace</p>
          <div className="workspace-tags">
            <span className="tag">List + Detail</span>
            <span className="tag">Map-Ready</span>
          </div>
        </header>
        <main className="page-wrap">
          <Outlet />
        </main>
      </section>
    </div>
  );
}
