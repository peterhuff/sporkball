import {
    Outlet,
    Link,
    useFetcher,
    useNavigation,
} from "react-router";
import type { Route } from "./+types/header";
import {
    useState,
    useEffect,
} from "react";
import type { clientLoader } from "~/routes/search-players";

import BaseballIcon from "~/images/baseball.svg";
import SearchIcon from "~/images/search.svg";
import MenuIcon from "~/images/menu.svg";
import ExitIcon from "~/images/exit.svg";
import SearchIconGray from "~/images/search-gray.svg";

import type { PlayerId } from "~/util";

export async function loader() {
    const url = "https://statsapi.mlb.com/api/v1/stats/leaders?leaderCategories=totalPlateAppearances&fields=leagueLeaders,leaders,person,id,fullName&limit=10";
    const response = await fetch(url)
        .then((res) => res.json());
    const topPlayers: Array<PlayerId> = response.leagueLeaders[0].leaders.map((player: any) => player.person);
    if (!topPlayers) {
        throw new Response("Not Found", { status: 404 });
    }
    return { topPlayers };
}

export default function HeaderLayout({
    loaderData,
}: Route.ComponentProps) {
    const { topPlayers } = loaderData;
    const navigation = useNavigation();

    const [isSearching, setIsSearching] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [delayTimer, setDelayTimer] = useState<NodeJS.Timeout | null>(null);

    const fetcher = useFetcher<typeof clientLoader>();

    useEffect(() => {
        if (navigation.state === "idle") {
            setIsSearching(false);
            setSearchValue("");
            fetcher.load("/search-players");
        }
    }, [navigation.state]);

    const searchChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value);

        if (delayTimer) {
            clearTimeout(delayTimer);
        }

        const newTimer = setTimeout(() => {
            fetcher.load(`/search-players?q=${event.target.value}`);
        }, 400);

        setDelayTimer(newTimer);
    }

    return (
        <>
            <header>
                {!isSearching &&
                    <Link className="home-links" to="/">
                        <img
                            src={BaseballIcon}
                            alt="Baseball icon"
                            className="header-icon"
                        />
                        <span>SPORKBALL</span>
                    </Link>
                }

                {isSearching ? (
                    <nav>
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
                                onChange={(event) => {
                                    searchChanged(event);
                                }}
                                className="player-search"
                                placeholder="Search"
                                autoComplete="off"
                            />
                        </div>
                        <button
                            type="button"
                            className="nav-button-mobile"
                            onClick={() => {
                                setIsSearching(false);
                                // if (searchRef.current) searchRef.current.select();
                            }}
                        >
                            <img
                                src={ExitIcon}
                                alt="Exit icon"
                                className="nav-icon"
                            />
                        </button>
                    </nav>

                ) : (
                    <nav>
                        <button
                            type="button"
                            className="search-button"
                            onClick={() => {
                                setIsSearching(true);
                            }}
                        >
                            <img
                                src={SearchIcon}
                                alt="Search icon"
                                className="search-icon"
                            />
                        </button>
                        <button
                            type="button"
                            className="nav-button-mobile"
                        >
                            <img
                                src={MenuIcon}
                                alt="Menu icon"
                                className="nav-icon"
                            />
                        </button>
                    </nav>
                )}
                {isSearching &&
                    <ul
                        className="search-results"
                        style={{
                            color: fetcher.state === "idle" ? "rgb(0, 0, 0, 1)" : "rgb(0, 0, 0, .25)",
                        }}
                    >
                        {(fetcher.data && fetcher.data.length > 0) ?
                            fetcher.data.map((player) => (
                                <li key={player.id} className="search-result">
                                    <Link
                                        to={`players/${urlName(player.fullName)}/${player.id}`} key={player.id}
                                        // onClick={() => setIsSearching(false)}
                                        className="player-link"
                                    >
                                        {player.fullName}
                                    </Link>
                                </li>
                            ))
                            :
                            topPlayers.map((player) => (
                                <li key={player.id} className="search-result">
                                    <Link
                                        to={`players/${urlName(player.fullName)}/${player.id}`} key={player.id}
                                        // onClick={() => setIsSearching(false)}
                                        className="player-link"
                                    >
                                        {player.fullName}
                                    </Link>
                                </li>
                            ))
                        }
                    </ul>
                }
            </header >
            <div
                className={
                    navigation.state === "loading" ? "loading" : ""
                }
            >
                <Outlet />
            </div>
        </>
    );
}

function urlName(fullName: string): string {
    const lowerCase = fullName.toLowerCase();
    const underscore = lowerCase.replaceAll(' ', '_');
    const noPeriods = underscore.replaceAll('.', '');
    const normalized = noPeriods.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return normalized;
}

function selectSearch(node: HTMLInputElement): void {
    node?.select();
}