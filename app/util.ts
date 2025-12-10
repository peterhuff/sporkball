
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
    currentOrg?: {
        id: TeamCode;
        name: string;
    }
    primaryPosition: number;
    debutDate: string;
    batSide: string;
    throwHand: string;
}

export enum Position {
    Pitcher = 1,
    Catcher,
    "First Baseman",
    "Second Baseman",
    "Third Baseman",
    Shortstop,
    Leftfielder,
    Centerfielder,
    Rightfielder,
    "Designated Hitter",
    Outfielder,
    "Two-Way",
}

type TeamCode = keyof typeof mlbTeams;

export const mlbTeams = {
    133: {
        name: "Athletics",
        abbreviation: "ATH",
        color: "#003831",
        fontColor: "white",
    },
    134: {
        name: "Pittsburgh Pirates",
        abbreviation: "PIT",
        color: "#FDB827",
        fontColor: "black",
    },
    135: {
        name: "San Diego Padres",
        abbreviation: "SDP",
        color: "#FFC425",
        fontColor: "black",
    },
    136: {
        name: "Seattle Mariners",
        abbreviation: "SEA",
        color: "#005C5C",
        fontColor: "white",
    },
    137: {
        name: "San Fransisco Giants",
        abbreviation: "SFG",
        color: "#FD5A1E",
        fontColor: "black",
    },
    138: {
        name: "St. Louis Cardinals",
        abbreviation: "STL",
        color: "#C41E3A",
        fontColor: "white",
    },
    139: {
        name: "Tampa Bay Rays",
        abbreviation: "TBR",
        color: "#8FBCE6",
        fontColor: "black",
    },
    140: {
        name: "Texas Rangers",
        abbreviation: "TEX",
        color: "#003278",
        fontColor: "white",
    },
    141: {
        name: "Toronto Blue Jays",
        abbreviation: "TOR",
        color: "#134A8E",
        fontColor: "white",
    },
    142: {
        name: "Minnesota Twins",
        abbreviation: "MIN",
        color: "#002B5C",
        fontColor: "white",
    },
    143: {
        name: "Philadelphia Phillies",
        abbreviation: "PHI",
        color: "#E81828",
        fontColor: "black",
    },
    144: {
        name: "Atlanta Braves",
        abbreviation: "ATL",
        color: "#13274F",
        fontColor: "white",
    },
    145: {
        name: "Chicago White Sox",
        abbreviation: "CHW",
        color: "#C4CED4",
        fontColor: "black",
    },
    146: {
        name: "Miami Marlins",
        abbreviation: "MIA",
        color: "#00A3E0",
        fontColor: "black",
    },
    147: {
        name: "New York Yankees",
        abbreviation: "NYY",
        color: "#C4CED3",
        fontColor: "black",
    },
    158: {
        name: "Milwaukee Brewers",
        abbreviation: "MIL",
        color: "#FFC52F",
        fontColor: "black",
    },
    108: {
        name: "Los Angeles Angels",
        abbreviation: "LAA",
        color: "#BA0021",
        fontColor: "white",
    },
    109: {
        name: "Arizona Diamondbacks",
        abbreviation: "ARI",
        color: "#3FC2CC",
        fontColor: "black",
    },
    110: {
        name: "Baltimore Orioles",
        abbreviation: "BAL",
        color: "#DF4601",
        fontColor: "black",
    },
    111: {
        name: "Boston Red Sox",
        abbreviation: "BOS",
        color: "#BD3039",
        fontColor: "black",
    },
    112: {
        name: "Chicago Cubs",
        abbreviation: "CHC",
        color: "#0E3386",
        fontColor: "white",
    },
    113: {
        name: "Cincinnati Reds",
        abbreviation: "CIN",
        color: "#C6011F",
        fontColor: "white",
    },
    114: {
        name: "Cleveland Guardians",
        abbreviation: "CLE",
        color: "#00385D",
        fontColor: "white",
    },
    115: {
        name: "Colorado Rockies",
        abbreviation: "COL",
        color: "#333366",
        fontColor: "white",
    },
    116: {
        name: "Detroit Tigers",
        abbreviation: "Det",
        color: "#FA4616",
        fontColor: "black",
    },
    117: {
        name: "Houston Astros",
        abbreviation: "HOU",
        color: "#EB6E1F",
        fontColor: "black",
    },
    118: {
        name: "Kansas City Royals",
        abbreviation: "KCR",
        color: "#004687",
        fontColor: "white",
    },
    119: {
        name: "Los Angeles Dodgers",
        abbreviation: "LAD",
        color: "#005A9C",
        fontColor: "white",
    },
    120: {
        name: "Washington Nationals",
        abbreviation: "WAS",
        color: "#AB0003",
        fontColor: "white",
    },
    121: {
        name: "New York Mets",
        abbreviation: "NYM",
        color: "#FF5910",
        fontColor: "black",
    },
};

// export async function getTop(): Promise<Array<PlayerId>> {
//     const url = "https://statsapi.mlb.com/api/v1/stats/leaders?leaderCategories=totalPlateAppearances&fields=leagueLeaders,leaders,person,id,firstName,lastName&limit=10";
//     const response = await fetch(url)
//         .then((res) => res.json());
//     const players: Array<PlayerId> = response.leagueLeaders[0].leaders.map((player: any) => player.person);
//     return players;
// }