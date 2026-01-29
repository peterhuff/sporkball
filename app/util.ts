
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
    debutDate?: string;
    batSide: string;
    throwHand: string;
}

type SplitObject = {
    careerHitting?: CareerHitting;
    yearHitting?: YearByYearHitting;
    careerPitching?: CareerPitching;
    yearPitching?: YearByYearPitching;
}

type Split = CareerHitting | YearByYearHitting | CareerPitching | YearByYearPitching;

interface CareerHitting {
    type: "career";
    group: "hitting";
    stats: HittingSplit;
}

interface YearByYearHitting {
    type: "yearByYear";
    group: "hitting";
    stats: Array<YearHitting>;
}

interface CareerPitching {
    type: "career";
    group: "pitching";
    stats: PitchingSplit;
}

interface YearByYearPitching {
    type: "yearByYear";
    group: "pitching";
    stats: Array<YearPitching>;
}

interface YearData {
    season: number;
    age: number;
    numTeams: number;
    partialYear: boolean;
}

interface HittingSplit {
    gamesPlayed: number;
    runs: number;
    doubles: number;
    triples: number;
    homeRuns: number;
    strikeOuts: number;
    baseOnBalls: number;
    ibb: number;
    hits: number;
    hitByPitch: number;
    avg: number;
    atBats: number;
    obp: number;
    slg: number;
    ops: number;
    caughtStealing: number;
    stolenBases: number;
    gidp: number;
    pitchesSeen: number;
    plateAppearances: number;
    totalBases: number;
    rbi: number;
    sacBunts: number;
    sacFlies: number;
    babip: number;
    team?: TeamCode;
}

export type YearHitting = HittingSplit & YearData;

interface PitchingSplit {
    gamesPlayed: number;
    gamesStarted: number;
    runs: number;
    homeRuns: number;
    strikeOuts: number;
    baseOnBalls: number;
    hits: number;
    hitByPitch: number;
    era: number;
    inningsPitched: string;
    wins: number;
    losses: number;
    saves: number;
    earnedRuns: number;
    whip: number;
    battersFaced: number;
    winPercentage: number;
    kbbRatio: number;
    soPer9: number;
    bbPer9: number;
    hitsPer9: number;
    hrPer9: number;
    team?: TeamCode;
}

export type YearPitching = PitchingSplit & YearData;

export function getSplits(results: any) {
    const splits: Array<Split> = results.map((result: any) => {
        if (result.group.displayName === "hitting") {
            if (result.type.displayName === "career") {
                const careerResults = result.splits[0].stat;
                const careerStats: HittingSplit = {
                    gamesPlayed: careerResults.gamesPlayed,
                    runs: careerResults.runs,
                    doubles: careerResults.doubles,
                    triples: careerResults.triples,
                    homeRuns: careerResults.homeRuns,
                    strikeOuts: careerResults.strikeOuts,
                    baseOnBalls: careerResults.baseOnBalls,
                    ibb: careerResults.intentionalWalks,
                    hits: careerResults.hits,
                    hitByPitch: careerResults.hitByPitch,
                    avg: Number(careerResults.avg),
                    atBats: careerResults.atBats,
                    obp: Number(careerResults.obp),
                    slg: Number(careerResults.slg),
                    ops: Number(careerResults.ops),
                    caughtStealing: careerResults.caughtStealing,
                    stolenBases: careerResults.stolenBases,
                    gidp: careerResults.groundIntoDoublePlay,
                    pitchesSeen: careerResults.numberOfPitches,
                    plateAppearances: careerResults.plateAppearances,
                    totalBases: careerResults.totalBases,
                    rbi: careerResults.rbi,
                    sacBunts: careerResults.sacBunts,
                    sacFlies: careerResults.sacFlies,
                    babip: careerResults.babip,
                    team: result.splits[0].team?.id,
                }
                const careerSplit: CareerHitting = {
                    stats: careerStats,
                    type: "career",
                    group: "hitting",
                }
                return careerSplit;
            } else {
                const yearResults = result.splits;
                const multiYears: Array<number> = [];
                let prevAge: number;
                const yearStats: Array<YearHitting> = yearResults.map((year: any) => {
                    const stats = year.stat;
                    if (stats.age) {
                        prevAge = stats.age;
                    }
                    const yearSplit: YearHitting = {
                        season: Number(year.season),
                        age: stats.age ?? prevAge,
                        gamesPlayed: stats.gamesPlayed,
                        runs: stats.runs,
                        doubles: stats.doubles,
                        triples: stats.triples,
                        homeRuns: stats.homeRuns,
                        strikeOuts: stats.strikeOuts,
                        baseOnBalls: stats.baseOnBalls,
                        ibb: stats.intentionalWalks,
                        hits: stats.hits,
                        hitByPitch: stats.hitByPitch,
                        avg: Number(stats.avg),
                        atBats: stats.atBats,
                        obp: Number(stats.obp),
                        slg: Number(stats.slg),
                        ops: Number(stats.ops),
                        caughtStealing: stats.caughtStealing,
                        stolenBases: stats.stolenBases,
                        gidp: stats.groundIntoDoublePlay,
                        pitchesSeen: stats.numberOfPitches,
                        plateAppearances: stats.plateAppearances,
                        totalBases: stats.totalBases,
                        rbi: stats.rbi,
                        sacBunts: stats.sacBunts,
                        sacFlies: stats.sacFlies,
                        babip: stats.babip,
                        team: year.team?.id,
                        numTeams: 1,
                        partialYear: false,
                    }
                    if (year.numTeams) {
                        yearSplit.numTeams = year.numTeams;
                        multiYears.push(year.season);
                    }
                    return yearSplit;
                });
                yearStats.forEach(row => {
                    if (multiYears.includes(row.season) && row.numTeams === 1) {
                        row.partialYear = true;
                    }
                });
                const yearByYearHitting: YearByYearHitting = {
                    type: "yearByYear",
                    group: "hitting",
                    stats: yearStats,
                }
                return yearByYearHitting;
            }
        } else if (result.group.displayName === "pitching") {
            if (result.type.displayName === "career") {
                const careerResults = result.splits[0].stat;
                const careerStats: PitchingSplit = {
                    gamesPlayed: careerResults.gamesPlayed,
                    runs: careerResults.runs,
                    homeRuns: careerResults.homeRuns,
                    strikeOuts: careerResults.strikeOuts,
                    baseOnBalls: careerResults.baseOnBalls,
                    hits: careerResults.hits,
                    hitByPitch: careerResults.hitByPitch,
                    gamesStarted: careerResults.gamesStarted,
                    era: Number(careerResults.era),
                    inningsPitched: careerResults.inningsPitched,
                    wins: careerResults.wins,
                    losses: careerResults.losses,
                    saves: careerResults.saves,
                    earnedRuns: careerResults.earnedRuns,
                    whip: Number(careerResults.whip),
                    battersFaced: careerResults.battersFaced,
                    winPercentage: Number(careerResults.winPercentage),
                    kbbRatio: Number(careerResults.strikeoutWalkRatio),
                    soPer9: Number(careerResults.strikeoutsPer9Inn),
                    bbPer9: Number(careerResults.walksPer9Inn),
                    hitsPer9: Number(careerResults.hitsPer9Inn),
                    hrPer9: Number(careerResults.homeRunsPer9),
                    team: result.splits[0].team?.id,
                }
                const careerSplit: CareerPitching = {
                    stats: careerStats,
                    type: "career",
                    group: "pitching",
                }
                return careerSplit;
            } else {
                const yearResults = result.splits;
                const multiYears: Array<number> = [];
                let prevAge: number;
                const yearStats: Array<YearPitching> = yearResults.map((year: any) => {
                    const stats = year.stat;
                    if (stats.age) {
                        prevAge = stats.age;
                    }
                    const yearSplit: YearPitching = {
                        season: Number(year.season),
                        age: stats.age ?? prevAge,
                        gamesPlayed: stats.gamesPlayed,
                        runs: stats.runs,
                        homeRuns: stats.homeRuns,
                        strikeOuts: stats.strikeOuts,
                        baseOnBalls: stats.baseOnBalls,
                        hits: stats.hits,
                        hitByPitch: stats.hitByPitch,
                        gamesStarted: stats.gamesStarted,
                        era: Number(stats.era),
                        inningsPitched: stats.inningsPitched,
                        wins: stats.wins,
                        losses: stats.losses,
                        saves: stats.saves,
                        earnedRuns: stats.earnedRuns,
                        whip: Number(stats.whip),
                        battersFaced: stats.battersFaced,
                        winPercentage: Number(stats.winPercentage),
                        kbbRatio: Number(stats.strikeoutWalkRatio),
                        soPer9: Number(stats.strikeoutsPer9Inn),
                        bbPer9: Number(stats.walksPer9Inn),
                        hitsPer9: Number(stats.hitsPer9Inn),
                        hrPer9: Number(stats.homeRunsPer9),
                        team: year.team?.id,
                        numTeams: 1,
                        partialYear: false,
                    }
                    if (year.numTeams) {
                        yearSplit.numTeams = year.numTeams;
                        multiYears.push(year.season);
                    }
                    return yearSplit;
                });
                yearStats.forEach(row => {
                    if (multiYears.includes(row.season) && row.numTeams === 1) {
                        row.partialYear = true;
                    }
                });
                const yearByYearPitching: YearByYearPitching = {
                    type: "yearByYear",
                    group: "pitching",
                    stats: yearStats,
                }
                return yearByYearPitching;
            }
        }
    })
    const splitsObject: SplitObject = {
        careerHitting: splits.find((element) => (element.group === "hitting" && element.type === "career")),
        yearHitting: splits.find((element) => (element.group === "hitting" && element.type === "yearByYear")),
        careerPitching: splits.find((element) => (element.group === "pitching" && element.type === "career")),
        yearPitching: splits.find((element) => (element.group === "pitching" && element.type === "yearByYear")),
    }
    return splitsObject;
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
        fontColor: "white",
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
        fontColor: "white",
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