import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import Login from "./pages/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import Admin from "./pages/admin/admin";
import Report from "./pages/admin/Report";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/admin",
    element: <Admin />,
  },
  {
    path: "/admin/report",
    element: <Report />,
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

export default function App() {
  return (
    <>
      <RouterProvider router={router} />,
    </>
  );
}
