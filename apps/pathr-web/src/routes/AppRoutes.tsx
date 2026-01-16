import { Route, Routes } from "react-router-dom";
import { AppLayout } from "../layout/AppLayout";
import { AppHomePage } from "../pages/AppHomePage";
import { TripsPage } from "../pages/TripsPage";
import { TripDetailPage } from "../pages/TripDetailPage";
import { SettingsPage } from "../pages/SettingsPage";
import { AboutPage } from "../pages/AboutPage";
import { NotFoundPage } from "../pages/NotFoundPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<AppHomePage />} />
      </Route>

      <Route path="/app" element={<AppLayout />}>
        <Route index element={<AppHomePage />} />
        <Route path="trips" element={<TripsPage />} />
        <Route path="trips/:id" element={<TripDetailPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="about" element={<AboutPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

