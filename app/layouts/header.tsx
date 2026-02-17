import {
    Outlet,
    Link,
    useFetcher,
    useNavigation,
    useOutletContext,
} from "react-router";
import type { Route } from "./+types/header";
import {
    useState,
    useEffect,
    useRef,
} from "react";
import type { clientLoader } from "~/routes/search-players";

import SporkballIcon from "~/images/sporkball.svg";
import SearchIcon from "~/images/search.svg";
import MenuIcon from "~/images/menu.svg";
import ExitIcon from "~/images/exit.svg";
import SearchIconGray from "~/images/search-gray.svg";

import type { PlayerId } from "~/util";
import { urlName } from "~/util"

// Gets a list of top 10 players by plate appearances from most recent season
// Will be used as default values for search bar
export async function loader() {

    // get list from api and convert to json
    const url = "https://statsapi.mlb.com/api/v1/stats/leaders?leaderCategories=totalPlateAppearances&fields=leagueLeaders,leaders,person,id,fullName,season&limit=10";
    const response = await fetch(url)
        .then((res) => res.json());

    // map json to array of PlayerIds
    const topPlayers: Array<PlayerId> = response.leagueLeaders[0].leaders.map((player: any) => player.person);
    const currentSeason = Number(response.leagueLeaders[0].leaders[0].season);

    if (!topPlayers) {
        throw new Response("Not Found", { status: 404 });
    }
    return { topPlayers, currentSeason };
}

type HeaderMode = 'none' | 'search' | 'menu';

export default function HeaderLayout({
    loaderData,
}: Route.ComponentProps) {

    const { topPlayers, currentSeason } = loaderData; // top 10 players by plate appearances
    const navigation = useNavigation();

    // state variables
    const [headerMode, setHeaderMode] = useState<HeaderMode>('none');
    const [searchValue, setSearchValue] = useState("");
    const [delayTimer, setDelayTimer] = useState<NodeJS.Timeout | null>(null); // delay timer for searchbar
    const [showResults, setShowResults] = useState(false);


    // ref to header allows click event handler to check if click was outside
    const comboRef = useRef<HTMLElement>(null);
    const searchRef = useRef<HTMLDivElement>(null);

    // fetcher for player search
    const fetcher = useFetcher<typeof clientLoader>();

    // clears search bar when new page is loaded
    useEffect(() => {

        // close search bar, clear input, empty search
        if (navigation.state === "idle") {
            setHeaderMode('none');
            setShowResults(false);
            setSearchValue("");
            fetcher.load("/search-players");
        }

    }, [navigation.state]);

    // creates event listener that closes search bar when user clicks outside of it
    useEffect(() => {

        // function defined inside of effect so dependency is not needed
        const handleClick = (event: MouseEvent) => {
            if (comboRef.current && !comboRef.current.contains(event.target as Node)) {
                setHeaderMode('none');
            }
        }

        window.addEventListener("click", handleClick, true);
        return () => {
            window.removeEventListener("click", handleClick, true);
        };

    }, []);

    // onChange function for searchbar
    // fetches data from search-players after user stops typing for 400 milliseconds
    const searchChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value);

        // clear any active timeout to reset the timer
        if (delayTimer) {
            clearTimeout(delayTimer);
        }

        // 400 millisecond timeout before loading players
        const newTimer = setTimeout(() => {
            fetcher.load(`/search-players?q=${event.target.value}`);
        }, 400);

        setDelayTimer(newTimer);
    };

    // if user is typing, clear searchbar instead of closing it
    const handleSearchKey = (event: React.KeyboardEvent<HTMLInputElement>): void => {
        // clear searchbar if there are any characters, otherwise close
        if (event.key === "Escape") {
            if (searchValue.length === 0) {
                setHeaderMode('none');
            }
        }
    };

    return (
        <>
            <header ref={comboRef}>
                {headerMode === 'search' ?
                    // if user is searching, navbar has searchbox and x button
                    <nav>
                        {/* search box */}
                        <div className="search-wrapper">
                            <img
                                src={SearchIconGray}
                                alt="Search icon"
                                className="search-icon"
                            />
                            <input
                                ref={selectSearch}
                                type="search"
                                name="q"
                                value={searchValue}
                                onChange={searchChanged}
                                onKeyDown={handleSearchKey}
                                className="player-search"
                                placeholder="Search"
                                autoComplete="off"
                            />
                        </div>
                        {/* x button */}
                        <button
                            type="button"
                            className="nav-button-mobile"
                            onClick={() => {
                                setHeaderMode('none');
                            }}
                        >
                            <img
                                src={ExitIcon}
                                alt="Exit icon"
                                className="nav-icon"
                            />
                        </button>
                    </nav> :
                    // if user is not searching, navbar has home icon, title, search button, and menu button
                    <nav>
                        {/* home icon and title */}
                        <Link className="home-links" to="/">
                            <img
                                src={SporkballIcon}
                                alt="Sporkball icon"
                                className="header-icon"
                            />
                            <span>SPORKBALL</span>
                        </Link>
                        <div className="nav-buttons">
                            <div className="nav-links">
                                <Link to="/" className="nav-link">
                                    HOME
                                </Link>
                                <Link to="/about" className="nav-link">
                                    ABOUT
                                </Link>
                            </div>
                            {/* search button */}
                            <button
                                type="button"
                                className="search-button"
                                onClick={() => {
                                    setHeaderMode('search');
                                }}
                            >
                                <img
                                    src={SearchIcon}
                                    alt="Search icon"
                                    className="search-icon"
                                />
                                <span>Search</span>
                            </button>
                            {/* menu button */}
                            <button
                                type="button"
                                className="nav-button-mobile"
                                onClick={() => {
                                    setHeaderMode((headerMode === 'none' ? 'menu' : 'none'));
                                }}
                            >
                                <img
                                    src={headerMode === 'menu' ? ExitIcon : MenuIcon}
                                    alt="Menu icon"
                                    className="nav-icon"
                                />
                            </button>
                            {/* desktop search bar */}
                            <div className="search-wrapper" id="desktop-search">
                                <img
                                    src={SearchIconGray}
                                    alt="Search icon"
                                    className="search-icon"
                                />
                                <input
                                    type="search"
                                    name="q"
                                    className="player-search"
                                    placeholder="Player Search"
                                    autoComplete="off"
                                    value={searchValue}
                                    onChange={searchChanged}
                                    onKeyDown={(e) => {
                                        if (e.key === "Escape") {
                                            if (searchValue.length === 0) {
                                                e.currentTarget.blur();
                                            }
                                        }
                                    }}
                                    onFocus={() => setShowResults(true)}
                                    onBlur={(e) => {
                                        if (e.relatedTarget?.id === "desktop-addition") {
                                            e.target.focus();
                                        } else if (e.relatedTarget?.className !== "nav-link") {
                                            setShowResults(false);
                                        }
                                    }
                                    }
                                />
                            </div>
                        </div>
                    </nav>
                }
                {headerMode !== 'none' &&
                    <div className="header-addition">
                        {headerMode === 'search' ?
                            <ul
                                // fade results if new search is loading
                                style={{
                                    color: fetcher.state === "idle" ? "inherit" : "rgb(0, 0, 0, .25)",
                                }}
                            >
                                {(fetcher.data && fetcher.data.length > 0) ?
                                    // if player has search results, show them
                                    fetcher.data.map((player) => (
                                        <li key={player.id} className="search-result">
                                            <Link
                                                to={`players/${urlName(player.fullName)}/${player.id}`} key={player.id}
                                                className="nav-link"
                                            >
                                                {player.fullName}
                                            </Link>
                                        </li>
                                    ))
                                    :
                                    // otherwise, show top 10 players by PA
                                    topPlayers.map((player) => (
                                        <li key={player.id} className="search-result">
                                            <Link
                                                to={`players/${urlName(player.fullName)}/${player.id}`} key={player.id}
                                                className="nav-link"
                                            >
                                                {player.fullName}
                                            </Link>
                                        </li>
                                    ))
                                }
                            </ul> :
                            <ul
                                className="text-right"
                            >
                                <li className="search-result">
                                    <Link to="/" className="nav-link">
                                        HOME
                                    </Link>
                                </li>
                                <li className="search-result">
                                    <Link to="/about" className="nav-link">
                                        ABOUT
                                    </Link>
                                </li>
                            </ul>
                        }

                    </div>
                }
                {showResults &&
                    <div
                        className="header-addition"
                        id="desktop-addition"
                        tabIndex={0}
                    >
                        <ul
                            // fade results if new search is loading
                            style={{
                                color: fetcher.state === "idle" ? "inherit" : "rgb(0, 0, 0, .25)",
                            }}
                        >
                            {(fetcher.data && fetcher.data.length > 0) ?
                                // if player has search results, show them
                                fetcher.data.map((player) => (
                                    <li key={player.id} className="search-result">
                                        <Link
                                            to={`players/${urlName(player.fullName)}/${player.id}`} key={player.id}
                                            className="nav-link"
                                        >
                                            {player.fullName}
                                        </Link>
                                    </li>
                                ))
                                :
                                // otherwise, show top 10 players by PA
                                topPlayers.map((player) => (
                                    <li key={player.id} className="search-result">
                                        <Link
                                            to={`players/${urlName(player.fullName)}/${player.id}`} key={player.id}
                                            className="nav-link"
                                        >
                                            {player.fullName}
                                        </Link>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                }
            </header >
            <div
                // content fades after delay when new page is loading
                className={navigation.state === "loading" ? "content loading" : "content"}
            >
                <Outlet context={currentSeason} />
            </div>
        </>
    );
}

export function getCurrentSeason() {
    return useOutletContext<number>();
}

// Selects searchbar whenever it is rendered
// ref callback calls when function changes, so it is defined outside the component
const selectSearch = (node: HTMLInputElement) => {
    node?.focus();
};
