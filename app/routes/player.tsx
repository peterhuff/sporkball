import type { PlayerId, Player } from "~/util";
import type { Route } from "./+types/player";

export async function loader({ params }: Route.LoaderArgs) {
    const { playerId } = params;

    const url = `https://statsapi.mlb.com/api/v1/people/${playerId}?fields=people,id,fullName,firstName,lastName`;
    const response = await fetch(url)
        .then((res) => res.json());
    const player: PlayerId = response.people[0];

    // const getCurrentOrg = async (team: { name: string, parentOrgId?: number }) => {
    //     if (team.parentOrgId) {
    //         const orgUrl = `https://statsapi.mlb.com/api/v1/teams/${team.parentOrgId}`;
    //         const orgTeam = await fetch(orgUrl)
    //             .then((res) => res.json());
    //         return orgTeam.teams[0].name;
    //     }
    //     return player.currentTeam.name;
    // };
    // const currentOrg = await getCurrentOrg(player.currentTeam);
    return { player };
}

export default function Player({ loaderData }: Route.ComponentProps) {
    const { player } = loaderData


    return (
        <div className="player-page">
            <title>{`${player.fullName} | Sporkball`}</title>
            <div className="bio-card">
                <h1>{player.fullName}</h1>
                <img
                    className="player-icon"
                    src={`https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_400,q_auto:best/v1/people/${player.id}/headshot/67/current`}
                />
            </div>
        </div>
    );
}