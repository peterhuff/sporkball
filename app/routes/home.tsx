import Leaderboard from "~/components/leaderboard";

export default function Home() {
  return (
    <div className="home-contents">
      <title>Home | Sporkball</title>
      <meta
        name="description"
        content="Sporkball Baseball homepage"
      />
      <div className="home-page">
        <Leaderboard
          group={"hitting"}
          season={2025}
          stat={"hits"}
        />
        <Leaderboard
          group={"hitting"}
          season={2025}
          stat={"gamesPlayed"}
        />
      </div>
    </div>
  );
}
