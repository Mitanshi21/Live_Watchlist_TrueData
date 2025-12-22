import { useEffect, useState } from "react";
import { DockviewReact } from "dockview";
import { symbolFetchApi } from "../services/symbolService";
import Search from "../components/Search";
import WatchlistTable from "../components/WatchlistTable";

export default function WatchList({
    tradeData,
    totalSubscribed,
    sendRequest,
    onUnsubscribe,
    symbolIdName,
    onLogout,
}) {
    const [symbols, setSymbols] = useState(["INFY", "SENSEX"]);
    const [allSymbols, setAllSymbols] = useState([]);

    useEffect(() => {
        symbolFetchApi().then(setAllSymbols);
    }, []);

    useEffect(() => {
        if (symbols.length) sendRequest(symbols);
    }, [symbols]);

    const SearchPanel = (props) => {
        const { allSymbols, setSymbols } = props.params;
        return (
            <Search
                allSymbols={allSymbols}
                onAddSymbol={(s) => setSymbols((prev) => [...prev, s])}
            />
        );
    };

    const WatchPanel = (props) => {
        const { tradeData, onUnsubscribe, symbolIdName, symbols } = props.params;

        return (
            <WatchlistTable
                tradeData={tradeData}
                onUnsubscribe={onUnsubscribe}
                symbolIdName={symbolIdName}
                symbols={symbols}
            />
        );
    };

    const dockComponents = {
        search: SearchPanel,
        watchlistPanel: WatchPanel,
    };

    useEffect(() => {
        const panel = window.__dockApi?.getPanel("watchlistPanel");
        panel?.update({
            params: {
                tradeData,
                onUnsubscribe,
                symbolIdName,
                symbols,
            },
        });
    }, [tradeData, symbols]);

    useEffect(() => {
        const searchPanel = window.__dockApi?.getPanel("search");
        searchPanel?.update({
            params: {
                allSymbols,
                setSymbols,
            },
        });
    }, [allSymbols]);

    return (
        <div className="main-container">
            <div style={{ flex: 1 }}>
                <DockviewReact
                    style={{ height: "100%", width: "100%" }}
                    components={dockComponents}
                    onReady={(e) => {
                        const api = e.api;
                        window.__dockApi = api;


                        api.addPanel({
                            id: "search",
                            component: "search",
                            title: "Search Symbols",
                            params: {
                                allSymbols,
                                setSymbols,
                            },
                        });

                        api.addPanel({
                            id: "watchlistPanel",
                            component: "watchlistPanel",
                            title: "Watchlist",
                            params: {
                                tradeData,
                                onUnsubscribe,
                                symbolIdName,
                                symbols,
                            },
                            position: { referencePanel: 'search', direction: 'below' }
                        });
                    }}
                />

            </div>

            <div className="status-bar">
                <h3>Total Subscribed: {totalSubscribed}</h3>
                <button onClick={onLogout} className="logout">
                    Logout
                </button>
            </div>
        </div>
    );
}
