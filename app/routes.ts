import type { RouteConfig } from "@react-router/dev/routes";
import {
    index,
    layout,
    route,
} from "@react-router/dev/routes";

export default [
    layout("layouts/header.tsx", [
        index("routes/home.tsx"),
    ]),
] satisfies RouteConfig;

