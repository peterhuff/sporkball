import type { Player } from "~/util";
import { Position, mlbTeams } from "~/util";
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

export async function loader({ params }: Route.LoaderArgs) {
    const { playerId } = params;

    const url = `https://statsapi.mlb.com/api/v1/people/${playerId}?hydrate=currentTeam,rosterEntries&fields=people,id,fullName,birthDate,birthCity,birthStateProvince,birthCountry,height,weight,rosterEntries,currentTeam,name,parentOrgId,primaryPosition,code,mlbDebutDate,batSide,description,pitchHand,fullFMLName`;
    const response = await fetch(url)
        .then((res) => res.json());
    const rawPlayer = response.people[0];


    const statsUrl = `https://statsapi.mlb.com/api/v1/people/${playerId}/stats?stats=yearByYear,career`;
    const statsResponse = await fetch(statsUrl)
        .then((res) => res.json());
    const stats = statsResponse.stats;



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
    // console.log(player);
    return { player, stats };
}

export default function Player({ loaderData }: Route.ComponentProps) {

    const { player, stats } = loaderData
    const navigation = useNavigation();
    const [showSpinner, setShowSpinner] = useState(true);
    const [prevId, setPrevId] = useState(player.id);

    if (player.id !== prevId) {
        setPrevId(player.id);
        setShowSpinner(true);
    }

    const yearList = stats[0]?.splits;
    const lastYear = yearList[yearList.length - 1];

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
                    {player.currentOrg ?
                        <h2>{player.currentOrg.name}</h2>
                        : null
                    }
                </div>
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
                {yearList &&
                    <div className="last-season">
                        <h2>2025</h2>
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
                                        <td>{lastYear.stat.gamesPlayed}</td>
                                        <td>{lastYear.stat.plateAppearances}</td>
                                        <td>{lastYear.stat.runs}</td>
                                        <td>{lastYear.stat.rbi}</td>
                                        <td>{lastYear.stat.hits}</td>
                                        <td>{lastYear.stat.homeRuns}</td>
                                        <td>{lastYear.stat.avg}</td>
                                        <td>{lastYear.stat.obp}</td>
                                        <td>{lastYear.stat.slg}</td>
                                        <td>{lastYear.stat.ops}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                }
            </div>



        </div>
    );
}

const codeToPosition = (code: number | 'O' | 'Y') => {
    switch (code) {
        case 'O':
            return 11;
        case 'Y':
            return 12;
        default:
            return code;
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


