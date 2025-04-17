// filepath: c:\Users\jjten\OneDrive\Desktop\Codes\Vite\Messenger\src\components\Layout.tsx
import NavBar from "./NavBar";
import { Outlet } from "react-router-dom";
import { useUser } from "../context/useUser";

function Layout() {
  const { user } = useUser();

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">Error: User not authenticated</p>
      </div>
    );
  }
  console.log();
  return (
    <div className="flex flex-row">
      <NavBar name={user.name} avatar={user.avatar} />
      <main className="p-4 w-full h-screen overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
