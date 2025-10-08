import { Outlet, Link } from "react-router";
import BaseballIcon from "~/images/baseball.svg";

export default function HeaderLayout() {
    return (
        <>
            <header>
                <Link className="home-links" to="/">
                    <img
                        src={BaseballIcon}
                        alt="Baseball icon"
                        className="header-icon"
                    />
                    <span>Sporkball</span>
                </Link>
                <nav>
                    <div className="search-wrapper">
                        <input
                            type="text"
                            placeholder="Search"
                        />
                    </div>
                </nav>
            </header>
            <div className="content">
                <Outlet />
            </div>
        </>
    );
}