import { useFetcher, Link } from "react-router";
import type { loader } from "~/routes/get-leaders";
import { useEffect } from "react";

import { urlName, mlbTeams } from "~/util"


interface LeaderboardProps {
    group: "hitting" | "pitching";
    season: number;
    stat: string;
}


export default function Leaderboard(props: LeaderboardProps) {

    const { group, season, stat } = props;
    let fetcher = useFetcher<typeof loader>();

    const url = `/get-leaders?group=${group}&stat=${stat}&season=${season}`;

    useEffect(() => {
        if (!fetcher.data && fetcher.state === "idle") {
            fetcher.load(url);
        }
    }, [fetcher]);


    return fetcher.data ? (
        <div className="leaderboard">
            <h2>{capitalizeFirstLetter(stat)}</h2>
            <table>
                <tbody>
                    {fetcher.data.map((player, i, leaders) => {
                        const lastRank = leaders[i - 1]?.rank;
                        const multiTeams = (player.numTeams > 1);
                        return i < 10 ? (
                            <tr key={player.id}>
                                <td className="rank">{(lastRank !== player.rank) ? player.rank + "." : null}</td>
                                <td className="player-link">
                                    <Link
                                        to={`players/${urlName(player.fullName)}/${player.id}`}
                                    >
                                        {player.fullName}
                                    </Link>
                                    <div
                                        className="team-patch"
                                        // style={{
                                        //     backgroundColor: (multiTeams || !player.team) ? "lightgray" : mlbTeams[player.team].color,
                                        //     color: (multiTeams || !player.team) ? "black" : mlbTeams[player.team].fontColor,
                                        // }}
                                    >
                                        {(multiTeams || !player.team) ?
                                            (player.numTeams + "TM")
                                            : mlbTeams[player.team].abbreviation}
                                    </div>
                                </td>
                                <td className="value">
                                    {player.value}
                                </td>
                            </tr>
                        ) : null;
                    })}
                </tbody>
            </table>
        </div>
    ) : null;
}

const capitalizeFirstLetter = (val: string) => {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}
