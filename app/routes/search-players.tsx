import type { Route } from "./+types/search-players";
import type { PlayerId } from "~/util";

export async function clientLoader({ request }: Route.LoaderArgs) {
    const url = new URL(request.url);
    const query = url.searchParams.get("q");
    if (!query) {
        return [];
    }
    const searchUrl = `https://statsapi.mlb.com/api/v1/people/search?limit=10&fields=people,id,fullName&names=${query.toLowerCase()}`;
    const response = await fetch(searchUrl)
        .then((res) => res.json());
    const players: Array<PlayerId> = response.people;
    return players;
}