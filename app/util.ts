
export type PlayerId = {
    fullName: string;
    firstName?: string;
    lastName?: string;
    id: number;
}

// export async function getTop(): Promise<Array<PlayerId>> {
//     const url = "https://statsapi.mlb.com/api/v1/stats/leaders?leaderCategories=totalPlateAppearances&fields=leagueLeaders,leaders,person,id,firstName,lastName&limit=10";
//     const response = await fetch(url)
//         .then((res) => res.json());
//     const players: Array<PlayerId> = response.leagueLeaders[0].leaders.map((player: any) => player.person);
//     return players;
// }