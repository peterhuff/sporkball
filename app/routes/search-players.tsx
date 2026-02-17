import type { Route } from "./+types/search-players";
import type { PlayerId } from "~/util";

// get result of user player search
export async function clientLoader({ request }: Route.ClientLoaderArgs) {
    const url = new URL(request.url);
    const query = url.searchParams.get("q");
    if (!query) {
        return [];
    }
    // get 10 results from AL and NL
    const searchUrl = `https://statsapi.mlb.com/api/v1/people/search?limit=10&leagueIds=103,104&fields=people,id,fullName&names=${query.toLowerCase()}`;
    const response = await fetch(searchUrl)
        .then((res) => res.json());
    const players: Array<PlayerId> = response.people;
    return players;
}