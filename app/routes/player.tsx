import type { Player } from "~/util";
import { Position, mlbTeams } from "~/util";
import type { Route } from "./+types/player";

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
        isActive: rawPlayer.rosterEntries[0].isActive,
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
        if ((entry.team.id >= 133 && entry.team.id <= 147) || (entry.team.id == 158) || (entry.team.parentOrgId >= 108 && entry.team.parentOrgId <= 121)) {
            if (entry.isActive) {
                player.currentOrg = {
                    id: entry.team.id,
                    name: entry.team.name,
                };
            }
            break;
        }
    }

    return { player };
}

export default function Player({ loaderData }: Route.ComponentProps) {
    const { player } = loaderData


    return (
        <div className="player-page">
            <title>{`${player.fullName} | Sporkball`}</title>
            <div 
                className="bio-card" 
                style={{ backgroundColor: player.currentOrg ? mlbTeams[player.currentOrg.id].color : "white" }}>
                <div className="name-team">
                    <h1>{player.fullName}</h1>
                    {player.currentOrg ?
                        <h2>{player.currentOrg.name}</h2>
                        : null
                    }
                </div>
                <div className="player-info">
                    <img
                        className="player-icon"
                        src={`https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_400,q_auto:best/v1/people/${player.id}/headshot/67/current`}
                    />
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
                    <div className="info-line">
                        <p className="info-header">{`MLB Debut: ${parseDate(player.debutDate)}`}</p>
                    </div>
                    <div className="info-line">
                        <p className="info-header">{`Birthdate: ${parseDate(player.birthInfo.date)}`}</p>
                    </div>
                    <div className="info-line">
                        <p className="info-header">
                            {"Birthplace: " + player.birthInfo.city + ", "}
                            {player.birthInfo.stateProvince ? player.birthInfo.stateProvince + ", " : null}
                            {player.birthInfo.country}
                        </p>
                    </div>
                    <div className="info-line">
                        <p className="info-header">{`Full Name: ${player.fullFMLName}`}</p>
                    </div>
                </div>
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


