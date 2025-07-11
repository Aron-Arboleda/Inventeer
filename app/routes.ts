import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("theme", "routes/theme.ts"),
  layout("routes/auth/layout.tsx", [
    route("login", "routes/auth/login.tsx"),
    route("register", "routes/auth/register.tsx"),
    route("logout", "routes/auth/logout.ts"),
  ]),
  layout("routes/dashboard/layout.tsx", [
    ...prefix("dashboard", [
      index("routes/dashboard/index.tsx"),
      ...prefix("bulk-generator", [
        layout("routes/dashboard/bulk-generator/layout.tsx", [
          index("routes/dashboard/bulk-generator/index.tsx"),
          route("new", "routes/dashboard/bulk-generator/new.tsx"),
          route(":id/edit", "routes/dashboard/bulk-generator/edit.tsx"),
        ]),
      ]),
      ...prefix("orders", [
        layout("routes/dashboard/orders/layout.tsx", [
          index("routes/dashboard/orders/index.tsx"),
        ]),
      ]),
    ]),
  ]),
] satisfies RouteConfig;
