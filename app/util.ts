
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
    isActive: boolean;
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
        color: "#EFB21E",
    },
    134: {
        name: "Pittsburgh Pirates",
        abbreviation: "PIT",
        color: "#FDB827",
    },
    135: {
        name: "San Diego Padres",
        abbreviation: "SDP",
        color: "#FFC425",
    },
    136: {
        name: "Seattle Mariners",
        abbreviation: "SEA",
        color: "#005C5C",
    },
    137: {
        name: "San Fransisco Giants",
        abbreviation: "SFG",
        color: "#FD5A1E",
    },
    138: {
        name: "St. Louis Cardinals",
        abbreviation: "STL",
        color: "#C41E3A",
    },
    139: {
        name: "Tampa Bay Rays",
        abbreviation: "TBR",
        color: "#8FBCE6",
    },
    140: {
        name: "Texas Rangers",
        abbreviation: "TEX",
        color: "#003278",
    },
    141: {
        name: "Toronto Blue Jays",
        abbreviation: "TOR",
        color: "#134A8E",
    },
    142: {
        name: "Minnesota Twins",
        abbreviation: "MIN",
        color: "#D31145",
    },
    143: {
        name: "Philadelphia Phillies",
        abbreviation: "PHI",
        color: "#E81828",
    },
    144: {
        name: "Atlanta Braves",
        abbreviation: "ATL",
        color: "#CE1141",
    },
    145: {
        name: "Chicago White Sox",
        abbreviation: "CHW",
        color: "#C4CED4",
    },
    146: {
        name: "Miami Marlins",
        abbreviation: "MIA",
        color: "#00A3E0",
    },
    147: {
        name: "New York Yankees",
        abbreviation: "NYY",
        color: "#C4CED3",
    },
    158: {
        name: "Milwaukee Brewers",
        abbreviation: "MIL",
        color: "#FFC52F",
    },
    108: {
        name: "Los Angeles Angels",
        abbreviation: "LAA",
        color: "#BA0021",
    },
    109: {
        name: "Arizona Diamondbacks",
        abbreviation: "ARI",
        color: "#A71930",
    },
    110: {
        name: "Baltimore Orioles",
        abbreviation: "BAL",
        color: "#DF4601",
    },
    111: {
        name: "Boston Red Sox",
        abbreviation: "BOS",
        color: "#BD3039",
    },
    112: {
        name: "Chicago Cubs",
        abbreviation: "CHC",
        color: "#0E3386",
    },
    113: {
        name: "Cincinnati Reds",
        abbreviation: "CIN",
        color: "#C6011F",
    },
    114: {
        name: "Cleveland Guardians",
        abbreviation: "CLE",
        color: "#00385D",
    },
    115: {
        name: "Colorado Rockies",
        abbreviation: "COL",
        color: "#333366",
    },
    116: {
        name: "Detroit Tigers",
        abbreviation: "Det",
        color: "#FA4616",
    },
    117: {
        name: "Houston Astros",
        abbreviation: "HOU",
        color: "#EB6E1F",
    },
    118: {
        name: "Kansas City Royals",
        abbreviation: "KCR",
        color: "#004687",
    },
    119: {
        name: "Los Angeles Dodgers",
        abbreviation: "LAD",
        color: "#005A9C",
    },
    120: {
        name: "Washington Nationals",
        abbreviation: "WAS",
        color: "#AB0003",
    },
    121: {
        name: "New York Mets",
        abbreviation: "NYM",
        color: "#002D72",
    },
};

// export async function getTop(): Promise<Array<PlayerId>> {
//     const url = "https://statsapi.mlb.com/api/v1/stats/leaders?leaderCategories=totalPlateAppearances&fields=leagueLeaders,leaders,person,id,firstName,lastName&limit=10";
//     const response = await fetch(url)
//         .then((res) => res.json());
//     const players: Array<PlayerId> = response.leagueLeaders[0].leaders.map((player: any) => player.person);
//     return players;
// }