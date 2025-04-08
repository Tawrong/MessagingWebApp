// filepath: c:\Users\jjten\OneDrive\Desktop\Codes\Vite\Messenger\src\components\Layout.tsx
import NavBar from "./NavBar";
import { Outlet } from "react-router-dom";
import { useUser } from "../context/useUser"; // Adjust the import path as necessary
function Layout() {
  const { user } = useUser();
  return (
    <div className="flex flex-row">
      <NavBar name={user?.name || "Guest"} avatar={user?.avatar || ""} />
      <main className="p-4 w-full h-screen overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
