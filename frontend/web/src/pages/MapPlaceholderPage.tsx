import { PageTitle } from "../components/Ui";

export function MapPlaceholderPage(): JSX.Element {
  return (
    <div>
      <PageTitle title="Map" subtitle="Placeholder for upcoming interactive map module." />
      <section className="map-shell card">
        <aside className="map-side">
          <p className="badge">Planned</p>
          <h3>Map Controls</h3>
          <p>Future filters and layer toggles will live here.</p>
          <ul>
            <li>Candidate provider: Leaflet or MapLibre</li>
            <li>Pins: places and near-search center</li>
            <li>Overlays: radius circles and result bounds</li>
          </ul>
        </aside>
        <div className="map-canvas-placeholder">
          <div>
            <p className="eyebrow">Preview frame</p>
            <h3>Interactive map area reserved</h3>
            <p>Recreates the common travel-app split view where list and map work side by side.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
