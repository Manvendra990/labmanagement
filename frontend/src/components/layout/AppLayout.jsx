import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AppLayout() {
  return (
    <div className="app-shell">

      {/* Full width top header */}
      <Header />

      {/* Everything below header */}
      <div className="app-workspace">

        {/* Left navigation */}
        <Sidebar />

        {/* Current route/page */}
        <main className="app-content">
          <Outlet />
        </main>

      </div>

    </div>
  );
}