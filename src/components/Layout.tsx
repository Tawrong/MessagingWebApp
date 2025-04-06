// filepath: c:\Users\jjten\OneDrive\Desktop\Codes\Vite\Messenger\src\components\Layout.tsx
import NavBar from "./NavBar";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="flex flex-row">
      <NavBar />
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;