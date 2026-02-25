import { Link } from "react-router";
import GithubIcon from "~/images/github.svg";

export default function About() {
    return (
        <div className="about-page">
            <title>About | Sporkball</title>
            <div className="about-text">
                <div className="about-heading">
                    <h1>About Sporkball</h1>
                    <span>•</span>
                    <a href="https://github.com/peterhuff/sporkball" target="_blank" className="github-link">
                        <img
                            src={GithubIcon}
                            alt="Github icon"
                            className="github-icon"
                        />
                    </a>
                </div>
                <p>Welcome to sporkball.com! This is a React Router project utilizing <a target="_blank" href="https://statsapi.mlb.com/">MLB's stats api</a>.
                    You can view leaders from the most recent MLB season on the <Link to="/">homepage</Link>.
                    Player profiles for active and former MLB players can be found via the player search.
                    Sporkball is a work in progress, and new features are on the way. </p>
            </div>
        </div>
    );
}