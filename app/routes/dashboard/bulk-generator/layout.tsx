import { Outlet } from "react-router";

export const handle = {
  breadcrumb: "Bulk Generator",
};

function Layout() {
  return (
    <div className="p-4 pt-0">
      <Outlet />
    </div>
  );
}

export default Layout;
