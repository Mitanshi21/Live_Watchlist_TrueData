import { useEffect, useState } from "react";
import { symbolFetchApi } from "../services/symbolService";
import Search from "../components/Search";
import TradeTable from "../components/TradeTable";


export default function MainList({ tradeData, totalSubscribed, sendRequest, onUnsubscribe, symbolIdName, onLogout }) {

    const [symbols, setSymbols] = useState(['INFY', 'SENSEX'])

    const [allSymbols, setAllSymbols] = useState([]);

    useEffect(() => {
        symbolFetchApi().then(setAllSymbols)
    }, [])

    useEffect(() => {
        if (symbols.length)
            sendRequest(symbols)
    }, [symbols])

    

    return <>
        <div className="main-container">
            <Search
                allSymbols={allSymbols}
                onAddSymbol={(s) => setSymbols(prev => [...prev, s])}
            />

            <TradeTable
                tradeData={tradeData}
                onUnsubscribe={onUnsubscribe}
                symbolIdName={symbolIdName}
                symbols={symbols}
            />

            <h3>Total Subscribed:{totalSubscribed}</h3>

            <button onClick={onLogout} className="logout">Logout</button>
        </div>
    </>
}