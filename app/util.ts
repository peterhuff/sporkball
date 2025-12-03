
export interface PlayerId {
    fullName: string;
    id: number;
}

export interface Player extends PlayerId {
    fullFMLName: string;
    birthInfo: {
        date: string;
        city: string;
        stateProvince?: string;
        country: string;
    }
    height: string;
    weight: number;
    active: boolean;
    currentTeam: {
        id: number;
        name: string;
        parentOrgId?: number;
    }
    primaryPosition: string;
    debutDate: string;
    batSide: string;
    throwHand: string;
}

// export async function getTop(): Promise<Array<PlayerId>> {
//     const url = "https://statsapi.mlb.com/api/v1/stats/leaders?leaderCategories=totalPlateAppearances&fields=leagueLeaders,leaders,person,id,firstName,lastName&limit=10";
//     const response = await fetch(url)
//         .then((res) => res.json());
//     const players: Array<PlayerId> = response.leagueLeaders[0].leaders.map((player: any) => player.person);
//     return players;
// }