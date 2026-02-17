import type { Route } from "./+types/get-leaders";
import type { LeaderId } from "~/util";

export async function loader({ request }: Route.LoaderArgs) {
    const url = new URL(request.url);
    const group =  url.searchParams.get("group");
    const season =  url.searchParams.get("season");
    const stat =  url.searchParams.get("stat");


    const leadersUrl = `https://statsapi.mlb.com/api/v1/stats/leaders?leaderCategories=${stat}&statGroup=${group}&season=${season}&fields=leagueLeaders,leaders,rank,value,team,person,id,fullName,numTeams&limit=10`;
    const response = await fetch(leadersUrl)
        .then((res) => res.json());
    const leaders: Array<LeaderId> = response.leagueLeaders[0].leaders.map((obj: any) => {
        const player: LeaderId = {
            id: obj.person.id,
            fullName: obj.person.fullName,
            value: Number(obj.value),
            rank: obj.rank,
            team: obj.team.id,
            numTeams: obj.numTeams,
        }
        return player;
    });
    console.log("test");
    return leaders;
}