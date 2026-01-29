import type { Player, YearHitting, YearPitching } from "~/util";
import { Position, mlbTeams, getSplits } from "~/util";
import { getCurrentSeason } from "~/layouts/header";
import type { Route } from "./+types/player";
import { useNavigation } from "react-router";
import { useState } from "react";

enum Month {
    January = 1,
    February,
    March,
    April,
    May,
    June,
    July,
    August,
    September,
    October,
    November,
    December,
}
interface SortMethod<T> { field: keyof T, asc: boolean }
type YearSplit = YearHitting | YearPitching;

export async function loader({ params }: Route.LoaderArgs) {
    const { playerId } = params;

    const url = `https://statsapi.mlb.com/api/v1/people/${playerId}?hydrate=currentTeam,rosterEntries&fields=people,id,fullName,birthDate,birthCity,birthStateProvince,birthCountry,height,weight,rosterEntries,currentTeam,name,parentOrgId,primaryPosition,code,mlbDebutDate,batSide,description,pitchHand,fullFMLName`;
    const response = await fetch(url)
        .then((res) => res.json());
    const rawPlayer = response.people[0];


    const statsUrl = `https://statsapi.mlb.com/api/v1/people/${playerId}/stats?stats=yearByYear,career&group=hitting,pitching`;
    const statsResponse = await fetch(statsUrl)
        .then((res) => res.json());
    const stats = getSplits(statsResponse.stats);

    const player: Player = {
        fullName: rawPlayer.fullName,
        id: rawPlayer.id,
        fullFMLName: rawPlayer.fullFMLName,
        birthInfo: {
            date: rawPlayer.birthDate,
            city: rawPlayer.birthCity,
            stateProvince: rawPlayer.birthStateProvince, // ?? undefined
            country: rawPlayer.birthCountry,
        },
        height: rawPlayer.height,
        weight: rawPlayer.weight,
        primaryPosition: codeToPosition(rawPlayer.primaryPosition.code),
        debutDate: rawPlayer.mlbDebutDate,
        batSide: rawPlayer.batSide.description,
        throwHand: rawPlayer.pitchHand.description,
    };


    for (const entry of rawPlayer.rosterEntries) {
        if (entry.team.parentOrgId &&
            ((entry.team.parentOrgId >= 133 && entry.team.parentOrgId <= 147)
                || (entry.team.parentOrgId == 158)
                || (entry.team.parentOrgId >= 108 && entry.team.parentOrgId <= 121))
        ) {
            if (entry.isActive) {
                player.currentOrg = {
                    id: entry.team.parentOrgId,
                    name: mlbTeams[entry.team.parentOrgId as keyof typeof mlbTeams].name,
                }
            }
            break;
        }

        if ((entry.team.id >= 133 && entry.team.id <= 147) || (entry.team.id == 158) || (entry.team.id >= 108 && entry.team.id <= 121)) {
            if (entry.isActive) {
                player.currentOrg = {
                    id: entry.team.id,
                    name: entry.team.name,
                };
            }
            break;
        }
    }
    return { player, stats };
}

export default function Player({ loaderData }: Route.ComponentProps) {

    const { player, stats } = loaderData;
    const currentSeason = getCurrentSeason();

    const navigation = useNavigation();
    const [showSpinner, setShowSpinner] = useState(true);
    const [hittingSort, setHittingSort] = useState<SortMethod<YearHitting>>({ field: "season", asc: true });
    const [pitchingSort, setPitchingSort] = useState<SortMethod<YearPitching>>({ field: "season", asc: true });
    const [typeIndex, setTypeIndex] = useState<number>(0);
    const [prevId, setPrevId] = useState(player.id);

    // if we're on a new player, show the headshot spinner
    if (player.id !== prevId) {
        setPrevId(player.id);
        setShowSpinner(true);
    }

    // career and year-by-year hitting and pitching stats
    // will be undefined if only one stat group is present
    const { yearHitting, careerHitting, yearPitching, careerPitching } = stats;

    const recentHitting = yearHitting?.stats[yearHitting.stats.length - 1];
    const filteredHittingStats = yearHitting?.stats.filter((row) => !row.partialYear);
    const hittingTableStats = filteredHittingStats ? sortRows(filteredHittingStats, hittingSort) : undefined;

    const recentPitching = yearPitching?.stats[yearPitching.stats.length - 1];
    const filteredPitchingStats = yearPitching?.stats.filter((row) => !row.partialYear);
    const pitchingTableStats = filteredPitchingStats ? sortRows(filteredPitchingStats, pitchingSort) : undefined;

    const statTypes: Array<"hitting" | "pitching"> = (() => {
        if (yearHitting && careerHitting) {
            if (yearPitching && careerPitching) {
                if (player.primaryPosition == 1) {
                    return ["pitching", "hitting"];
                }
                else {
                    return ["hitting", "pitching"];
                }
            }
            else {
                return ["hitting"];
            }
        } else {
            if (yearPitching && careerPitching) {
                return ["pitching"];
            } else {
                return [];
            }
        }
    })();

    // console.log(statTypes);

    // event handler for when hitting stats headers are clicked to sort
    // if current sorting stat is clicked, change direction
    const handleHittingSort = (field: keyof YearHitting) => {
        const newMethod: SortMethod<YearHitting> = { field: field, asc: false }
        if (hittingSort.field == field) {
            newMethod.asc = !hittingSort.asc;
        }
        else if (field == "season" || field == "age") {
            newMethod.asc = true;
        }
        setHittingSort(newMethod);
    };

    // event handler for when pitching stats headers are clicked to sort
    // if current sorting stat is clicked, change direction
    const handlePitchingSort = (field: keyof YearPitching) => {
        const newMethod: SortMethod<YearPitching> = { field: field, asc: false }
        if (pitchingSort.field == field) {
            newMethod.asc = !pitchingSort.asc;
        }
        else if (field == "season" || field == "age") {
            newMethod.asc = true;
        }
        setPitchingSort(newMethod);
    };

    return (
        <div className="player-page">
            <title>{`${player.fullName} | Sporkball`}</title>
            <div
                className="bio-card"
                style={{
                    backgroundColor: player.currentOrg ? mlbTeams[player.currentOrg.id].color : "lightgray",
                    color: player.currentOrg ? mlbTeams[player.currentOrg.id].fontColor : "black",
                }}>
                <div className="name-team">
                    <h1>{player.fullName}</h1>
                    {player.currentOrg &&
                        <h2>{player.currentOrg.name}</h2>
                    }
                </div>
                {/* Biographical info and headshot */}
                <div className="player-info">
                    <div className="icon-wrapper">

                        {navigation.state === 'idle' &&
                            <img
                                className="player-icon"
                                src={`https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_400,q_auto:best/v1/people/${player.id}/headshot/67/current`}
                                loading="lazy"
                                onLoad={() => setShowSpinner(false)}
                                key={player.id}
                                alt={player.fullName + " icon"}
                            />
                        }
                        {showSpinner &&
                            <div className="loading-splash-spinner" />
                        }
                    </div>
                    <div className="info-line">
                        <p className="info-header">{`Position: ${Position[player.primaryPosition]}`}</p>
                    </div>
                    <div className="info-line">
                        <p className="info-header">{`Bats: ${player.batSide}`}</p>
                        <p>•</p>
                        <p className="info-header">{`Throws: ${player.throwHand}`}</p>
                    </div>
                    <div className="info-line">
                        <p className="info-header">{`Height: ${player.height}`}</p>
                        <p>•</p>
                        <p className="info-header">{`Weight: ${player.weight}`}</p>
                    </div>
                    {player.debutDate &&
                        <div className="info-line">
                            <p className="info-header">{`MLB Debut: ${parseDate(player.debutDate)}`}</p>
                        </div>
                    }
                    <div className="info-line">
                        <p className="info-header">
                            {"Birthplace: " + player.birthInfo.city + ", "}
                            {player.birthInfo.stateProvince ? player.birthInfo.stateProvince + ", " : null}
                            {player.birthInfo.country}
                        </p>
                    </div>
                    <div className="info-line">
                        <p className="info-header">{`Birthdate: ${parseDate(player.birthInfo.date)}`}</p>
                    </div>
                    <div className="info-line">
                        <p className="info-header">{`Full Name: ${player.fullFMLName}`}</p>
                    </div>
                </div>
            </div>
            <div className="player-content">
                {statTypes.length > 0 ?
                    <div className="type-list">
                        {statTypes.map((type, i) => (
                            <h2
                                className="type-selector"
                                style={{ color: (i === typeIndex) ? "inherit" : "rgb(102, 102, 102)" }}
                                onClick={() => setTypeIndex(i)}
                                key={i}
                            >
                                {type === "hitting" ? "Batting" : "Pitching"}
                            </h2>
                        ))}
                    </div>
                    : <h2>No MLB Stats Found</h2>
                }
                {(careerHitting && hittingTableStats && statTypes[typeIndex] === "hitting") &&
                    <div className="stats-tables">
                        {recentHitting?.season === currentSeason &&
                            <div className="last-season">
                                <h2>{recentHitting.season}</h2>
                                <div className="table-wrapper">
                                    <table className="player-table">
                                        <thead>
                                            <tr>
                                                <th scope="col">G</th>
                                                <th scope="col">PA</th>
                                                <th scope="col">R</th>
                                                <th scope="col">RBI</th>
                                                <th scope="col">H</th>
                                                <th scope="col">HR</th>
                                                <th scope="col">AVG</th>
                                                <th scope="col">OBP</th>
                                                <th scope="col">SLG</th>
                                                <th scope="col">OPS</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>{recentHitting.gamesPlayed}</td>
                                                <td>{recentHitting.plateAppearances}</td>
                                                <td>{recentHitting.runs}</td>
                                                <td>{recentHitting.rbi}</td>
                                                <td>{recentHitting.hits}</td>
                                                <td>{recentHitting.homeRuns}</td>
                                                <td>{statString(recentHitting.avg)}</td>
                                                <td>{statString(recentHitting.obp)}</td>
                                                <td>{statString(recentHitting.slg)}</td>
                                                <td>{statString(recentHitting.ops)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        }
                        <div className="year-stats">
                            <h2>Career</h2>
                            <div className="table-wrapper">
                                <table className="player-table">
                                    <thead>
                                        <tr>
                                            <th scope="col" onClick={() => handleHittingSort("season")}>Year</th>
                                            <th scope="col" onClick={() => handleHittingSort("age")}>Age</th>
                                            <th scope="col" onClick={() => handleHittingSort("team")}>Team</th>
                                            <th scope="col" onClick={() => handleHittingSort("gamesPlayed")}>G</th>
                                            <th scope="col" onClick={() => handleHittingSort("plateAppearances")}>PA</th>
                                            <th scope="col" onClick={() => handleHittingSort("runs")}>R</th>
                                            <th scope="col" onClick={() => handleHittingSort("rbi")}>RBI</th>
                                            <th scope="col" onClick={() => handleHittingSort("hits")}>H</th>
                                            <th scope="col" onClick={() => handleHittingSort("homeRuns")}>HR</th>
                                            <th scope="col" onClick={() => handleHittingSort("avg")}>AVG</th>
                                            <th scope="col" onClick={() => handleHittingSort("obp")}>OBP</th>
                                            <th scope="col" onClick={() => handleHittingSort("slg")}>SLG</th>
                                            <th scope="col" onClick={() => handleHittingSort("ops")}>OPS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {hittingTableStats.map((row) => (
                                            <tr key={row.season}>
                                                <td>{row.season}</td>
                                                <td>{row.age}</td>
                                                <td>{row.team ? mlbTeams[row.team].abbreviation : row.numTeams + "TM"}</td>
                                                <td>{row.gamesPlayed}</td>
                                                <td>{row.plateAppearances}</td>
                                                <td>{row.runs}</td>
                                                <td>{row.rbi}</td>
                                                <td>{row.hits}</td>
                                                <td>{row.homeRuns}</td>
                                                <td>{statString(row.avg)}</td>
                                                <td>{statString(row.obp)}</td>
                                                <td>{statString(row.slg)}</td>
                                                <td>{statString(row.ops)}</td>
                                            </tr>
                                        ))}
                                        <tr className="career-stats">
                                            <td>Total</td>
                                            <td></td>
                                            <td>{careerHitting.stats.team ? mlbTeams[careerHitting.stats.team].abbreviation : "---"}</td>
                                            <td>{careerHitting.stats.gamesPlayed}</td>
                                            <td>{careerHitting.stats.plateAppearances}</td>
                                            <td>{careerHitting.stats.runs}</td>
                                            <td>{careerHitting.stats.rbi}</td>
                                            <td>{careerHitting.stats.hits}</td>
                                            <td>{careerHitting.stats.homeRuns}</td>
                                            <td>{statString(careerHitting.stats.avg)}</td>
                                            <td>{statString(careerHitting.stats.obp)}</td>
                                            <td>{statString(careerHitting.stats.slg)}</td>
                                            <td>{statString(careerHitting.stats.ops)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                }
                {(careerPitching && pitchingTableStats && statTypes[typeIndex] === "pitching") &&
                    <div className="stats-tables">
                        {recentPitching?.season === currentSeason &&
                            <div className="last-season">
                                <h2>{recentPitching.season}</h2>
                                <div className="table-wrapper">
                                    <table className="player-table">
                                        <thead>
                                            <tr>
                                                <th scope="col">G</th>
                                                <th scope="col">GS</th>
                                                <th scope="col">W</th>
                                                <th scope="col">L</th>
                                                <th scope="col">ERA</th>
                                                <th scope="col">IP</th>
                                                <th scope="col">WHIP</th>
                                                <th scope="col">K/9</th>
                                                <th scope="col">BB/9</th>
                                                <th scope="col">SV</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>{recentPitching.gamesPlayed}</td>
                                                <td>{recentPitching.gamesStarted}</td>
                                                <td>{recentPitching.wins}</td>
                                                <td>{recentPitching.losses}</td>
                                                <td>{recentPitching.era.toFixed(2)}</td>
                                                <td>{recentPitching.inningsPitched}</td>
                                                <td>{recentPitching.whip}</td>
                                                <td>{recentPitching.soPer9.toFixed(1)}</td>
                                                <td>{recentPitching.bbPer9.toFixed(1)}</td>
                                                <td>{recentPitching.saves}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        }
                        <div className="year-stats">
                            <h2>Career</h2>
                            <div className="table-wrapper">
                                <table className="player-table">
                                    <thead>
                                        <tr>
                                            <th scope="col" onClick={() => handlePitchingSort("season")}>Year</th>
                                            <th scope="col" onClick={() => handlePitchingSort("age")}>Age</th>
                                            <th scope="col" onClick={() => handlePitchingSort("team")}>Team</th>
                                            <th scope="col" onClick={() => handlePitchingSort("gamesPlayed")}>G</th>
                                            <th scope="col" onClick={() => handlePitchingSort("gamesStarted")}>GS</th>
                                            <th scope="col" onClick={() => handlePitchingSort("wins")}>W</th>
                                            <th scope="col" onClick={() => handlePitchingSort("losses")}>L</th>
                                            <th scope="col" onClick={() => handlePitchingSort("era")}>ERA</th>
                                            <th scope="col" onClick={() => handlePitchingSort("inningsPitched")}>IP</th>
                                            <th scope="col" onClick={() => handlePitchingSort("whip")}>WHIP</th>
                                            <th scope="col" onClick={() => handlePitchingSort("soPer9")}>K/9</th>
                                            <th scope="col" onClick={() => handlePitchingSort("bbPer9")}>BB/9</th>
                                            <th scope="col" onClick={() => handlePitchingSort("saves")}>SV</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pitchingTableStats.map((row) => (
                                            <tr key={row.season}>
                                                <td>{row.season}</td>
                                                <td>{row.age}</td>
                                                <td>{row.team ? mlbTeams[row.team].abbreviation : row.numTeams + "TM"}</td>
                                                <td>{row.gamesPlayed}</td>
                                                <td>{row.gamesStarted}</td>
                                                <td>{row.wins}</td>
                                                <td>{row.losses}</td>
                                                <td>{row.era.toFixed(2)}</td>
                                                <td>{row.inningsPitched}</td>
                                                <td>{row.whip}</td>
                                                <td>{row.soPer9.toFixed(1)}</td>
                                                <td>{row.bbPer9.toFixed(1)}</td>
                                                <td>{row.saves}</td>
                                            </tr>
                                        ))}
                                        <tr className="career-stats">
                                            <td>Total</td>
                                            <td></td>
                                            <td>{careerPitching.stats.team ? mlbTeams[careerPitching.stats.team].abbreviation : "---"}</td>
                                            <td>{careerPitching.stats.gamesPlayed}</td>
                                            <td>{careerPitching.stats.gamesStarted}</td>
                                            <td>{careerPitching.stats.wins}</td>
                                            <td>{careerPitching.stats.losses}</td>
                                            <td>{careerPitching.stats.era.toFixed(2)}</td>
                                            <td>{careerPitching.stats.inningsPitched}</td>
                                            <td>{careerPitching.stats.whip}</td>
                                            <td>{careerPitching.stats.soPer9.toFixed(1)}</td>
                                            <td>{careerPitching.stats.bbPer9.toFixed(1)}</td>
                                            <td>{careerPitching.stats.saves}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
}

const codeToPosition = (code: string) => {
    switch (code) {
        case 'O':
            return 11;
        case 'Y':
            return 12;
        default:
            return Number(code);
    }
};

const parseDate = (date: string) => {
    const splitDate = date.split('-');
    if (splitDate[2].startsWith('0')) {
        splitDate[2] = splitDate[2].slice(1);
    }
    const newDate = `${Month[+splitDate[1]]} ${splitDate[2]}, ${splitDate[0]}`
    return newDate;
};

const statString = (num: number) => num.toFixed(3).replace(/0\./, '.');

function sortRows<T extends YearSplit>(splits: Array<T>, { field, asc }: { field: keyof T, asc: boolean }): Array<T> {
    const sorted = splits.toSorted((a, b) => {
        if (a[field] !== undefined && b[field] !== undefined && a[field] !== null && b[field] !== null) {
            if (field == "team" && a.team && b.team) {
                if (mlbTeams[a.team].abbreviation > mlbTeams[b.team].abbreviation) {
                    return asc ? 1 : -1;
                }
                if (mlbTeams[a.team].abbreviation < mlbTeams[b.team].abbreviation) {
                    return asc ? -1 : 1;
                }
            }
            if (field == "inningsPitched") {
                if (Number(a[field]) > Number(b[field])) {
                    return asc ? 1 : -1;
                }
                if (Number(a[field]) < Number(b[field])) {
                    return asc ? -1 : 1;
                }
            }
            if (a[field] > b[field]) {
                return asc ? 1 : -1;
            }
            if (a[field] < b[field]) {
                return asc ? -1 : 1;
            }
        } else {
            console.log(a[field] + " compared to " + b[field]);
        }
        return 0;
    });
    return sorted;
}