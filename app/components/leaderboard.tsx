import { useFetcher, Link } from "react-router";
import type { loader } from "~/routes/get-leaders";
import { useEffect } from "react";

import { urlName, mlbTeams } from "~/util";
import type { LeaderId } from "~/util";


interface LeaderboardProps {
    group: "hitting" | "pitching";
    stat: string;
    leaders: Array<LeaderId>;
}

export default function Leaderboard(props: LeaderboardProps) {

    const { group, stat, leaders } = props;

    return (
        <div className="leaderboard">
            <h2>{group === "hitting" ? hittingStatToString(stat) : pitchingStatToString(stat)}</h2>
            <table>
                <tbody>
                    {leaders.map((player, i, leaders) => {
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
                                    {valueToString(player.value, stat)}
                                </td>
                            </tr>
                        ) : null;
                    })}
                </tbody>
            </table>
        </div>
    );
}

// const capitalizeFirstLetter = (val: string) => {
//     return String(val).charAt(0).toUpperCase() + String(val).slice(1);
// }

const valueToString = (value: number, stat: string) => {
    if (stat === "avg" ||
        stat === "obp" ||
        stat === "slg" ||
        stat === "ops" ||
        stat === "babip" ||
        stat === "winPercentage") {
        return value.toFixed(3).replace(/0\./, '.');
    }
    if (stat === "inningsPitched") {
        return value.toFixed(1);
    }
    if (stat === "era" ||
        stat === "strikeoutWalkRatio" ||
        stat === "strikeoutsPer9Inn" ||
        stat === "walksPer9Inn" ||
        stat === "hitsPer9Inn" ||
        stat === "whip") {
        return value.toFixed(2);
    }
    return value;
}

const hittingStatToString = (stat: string) => {
    switch (stat) {
        case "gamesPlayed":
            return "Games Played";
        case "runs":
            return "Runs Scored";
        case "doubles":
            return "Doubles";
        case "triples":
            return "Triples";
        case "homeRuns":
            return "Home Runs";
        case "strikeOuts":
            return "Strikeouts";
        case "baseOnBalls":
            return "Walks";
        case "intentionalWalks":
            return "Intentional Walks";
        case "hits":
            return "Hits";
        case "hitByPitch":
            return "Hit By Pitch";
        case "avg":
            return "Batting Average";
        case "atBats":
            return "At Bats";
        case "obp":
            return "On-Base %";
        case "slg":
            return "Slugging %";
        case "ops":
            return "On-Base Plus Slugging";
        case "caughtStealing":
            return "Caught Stealing";
        case "stolenBases":
            return "Stolen Bases";
        case "groundIntoDoublePlay":
            return "GIDP";
        case "numberOfPitches":
            return "Pitches Seen";
        case "plateAppearances":
            return "Plate Appearances";
        case "totalBases":
            return "Total Bases";
        case "rbi":
            return "Runs Batted In";
        case "sacBunts":
            return "Sacrifice Hits";
        case "sacFlies":
            return "Sacrifice Flies";
        case "babip":
            return "BABIP";
        default: return "Unknown";
    }
}

const pitchingStatToString = (stat: string) => {
    switch (stat) {
        case "gamesPlayed":
            return "Games Played";
        case "runs":
            return "Runs Allowed";
        case "homeRuns":
            return "Home Runs";
        case "strikeOuts":
            return "Strikeouts";
        case "baseOnBalls":
            return "Walks";
        case "hits":
            return "Hits";
        case "hitByPitch":
            return "Hit By Pitch";
        case "gamesStarted":
            return "Games Started";
        case "era":
            return "Earned Run Average";
        case "inningsPitched":
            return "Innings Pitched";
        case "wins":
            return "Wins";
        case "losses":
            return "Losses";
        case "saves":
            return "Saves";
        case "earnedRuns":
            return "Earned Runs";
        case "whip":
            return "WHIP";
        case "battersFaced":
            return "Batters Faced";
        case "winPercentage":
            return "Win %";
        case "strikeoutWalkRatio":
            return "Strikeouts / Walks";
        case "strikeoutsPer9Inn":
            return "Strikeouts Per 9IP";
        case "walksPer9Inn":
            return "Walks Per 9IP";
        case "hitsPer9Inn":
            return "Hits Per 9IP";
        default: return "Unknown";
    }
}
