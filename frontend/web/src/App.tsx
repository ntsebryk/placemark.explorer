import { Route, Routes } from "react-router-dom";
import { AppLayout } from "./components/AppLayout";
import { GroupCreatePage } from "./pages/GroupCreatePage";
import { GroupDetailPage } from "./pages/GroupDetailPage";
import { GroupsListPage } from "./pages/GroupsListPage";
import { HomePage } from "./pages/HomePage";
import { MapPlaceholderPage } from "./pages/MapPlaceholderPage";
import { PlaceCreatePage } from "./pages/PlaceCreatePage";
import { PlaceDetailPage } from "./pages/PlaceDetailPage";
import { PlacesListPage } from "./pages/PlacesListPage";
import { PlacesNearPage } from "./pages/PlacesNearPage";

export function App(): JSX.Element {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/places" element={<PlacesListPage />} />
        <Route path="/places/new" element={<PlaceCreatePage />} />
        <Route path="/places/:id" element={<PlaceDetailPage />} />
        <Route path="/places/near" element={<PlacesNearPage />} />
        <Route path="/groups" element={<GroupsListPage />} />
        <Route path="/groups/new" element={<GroupCreatePage />} />
        <Route path="/groups/:id" element={<GroupDetailPage />} />
        <Route path="/map" element={<MapPlaceholderPage />} />
      </Route>
    </Routes>
  );
}
