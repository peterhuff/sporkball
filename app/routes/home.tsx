import Leaderboard from "~/components/leaderboard";
import { getCurrentSeason } from "~/layouts/header";
import type { LeaderId } from "~/util";
import type { Route } from "./+types/home";


interface LeaderboardProps {
  group: "hitting" | "pitching";
  season: number;
  stat: string;
}

export async function loader() {

  const hittingStatTypes = ["avg", "obp", "slg", "runs", "rbi", "homeRuns"];
  const pitchingStatTypes = ["era", "wins", "saves", "whip", "strikeoutsPer9Inn", "walksPer9Inn"];

  const fetchLeaders = async (group: "hitting" | "pitching", stat: string) => {
    const leadersUrl = `https://statsapi.mlb.com/api/v1/stats/leaders?leaderCategories=${stat}&statGroup=${group}&season=2025&fields=leagueLeaders,leaders,rank,value,team,person,id,fullName,numTeams&limit=10`;
      
    const response = await fetch(leadersUrl)
      .then((res) => res.json());
    const leaders: Array<LeaderId> = response.leagueLeaders[0].leaders.map((obj: any) => {
      const player: LeaderId = {
        id: obj.person.id,
        fullName: obj.person.fullName,
        value: Number(obj.value),
        rank: obj.rank,
        team: obj.team.id,
        numTeams: obj.numTeams,
      }
      return player;
    });
    return { stat, leaders };
  }

  const hittingLeaderData = await Promise.all(hittingStatTypes.map((stat) => fetchLeaders("hitting", stat)));
  const pitchingLeaderData = await Promise.all(pitchingStatTypes.map((stat) => fetchLeaders("pitching", stat)));

  return { hittingLeaderData, pitchingLeaderData }
}

export default function Home({
  loaderData,
}: Route.ComponentProps) {
  const { hittingLeaderData, pitchingLeaderData } = loaderData;
  const currentSeason = getCurrentSeason();

  return (
    <div className="home-page">
      <title>Home | Sporkball</title>
      <meta
        name="description"
        content="Sporkball Baseball Homepage"
      />
      <div>
        <h1>{currentSeason + " Leaders"}</h1>
        <div className="leaders-type">
          <h2>Batting</h2>
          <div className="leaders-box">
            {hittingLeaderData.map(({ stat, leaders }, i) =>
              <Leaderboard
                key={i}
                group="hitting"
                stat={stat}
                leaders={leaders}
              />
            )}
          </div>
        </div>
        <div className="leaders-type">
          <h2>Pitching</h2>
          <div className="leaders-box">
            {pitchingLeaderData.map(({ stat, leaders }, i) =>
              <Leaderboard
                key={i}
                group="pitching"
                stat={stat}
                leaders={leaders}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
