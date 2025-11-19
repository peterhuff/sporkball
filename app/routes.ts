import type { RouteConfig } from "@react-router/dev/routes";
import {
    index,
    layout,
    route,
} from "@react-router/dev/routes";

export default [
    layout("layouts/header.tsx", [
        index("routes/home.tsx"),
        route("about", "routes/about.tsx"),
        route(
            "search-players",
            "routes/search-players.tsx"
        ),
        route("players/:playerName/:playerId", "routes/player.tsx"),
    ]),
] satisfies RouteConfig;

