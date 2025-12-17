import { use, useEffect, useRef, useState } from "react"
import useWebSocket, { ReadyState } from "react-use-websocket"

export default function MainList() {
    const [symbol, setSymbol] = useState('')
    const [symbols, setSymbols] = useState([])

    const [symbolIdName, setSymbolIdName] = useState({});
    const [totalSubscribed, setTotalSubscribed] = useState(0);

    const [tradeData, setTradeData] = useState({});

    // const [color, setColor] = useState(false);

    const webSocketURL = 'wss://push.truedata.in:8082?user=td133&password=mitanshi@133'

    const ws = useRef(null);

    useEffect(() => {
        sendRequest();
    }, [symbols]);


    // useEffect(()=>{
    //     console.log('tradeData updated:', tradeData);
    // }, [tradeData]);
    useEffect(() => {
        ws.current = new WebSocket(webSocketURL);

        ws.current.onopen = () => {
            console.log("Web Socket is Connected!");
        }

        ws.current.onmessage = (e) => {
            const response = JSON.parse(e.data);

            if (response['trade']) {
                const tradeArray = response['trade'];
                const symbolName = tradeArray[0];

                setTradeData(prevData => {
                    let bgcolor = 'white';
                    if (prevData[symbolName]) {
                        const prevLTP = prevData[symbolName].data[2];
                        const newLTP = tradeArray[2];
                        if (newLTP < prevLTP) bgcolor = 'red';
                        else if (newLTP > prevLTP) bgcolor = 'green';
                        else bgcolor = 'white';
                    }

                    return {
                        ...prevData,
                        [symbolName]: {
                            data: tradeArray,
                            bgcolor
                        }
                    };
                });
            }

            if (response['message'] === "symbols added" && response['symbollist']) {
                const newSymbolList = response['symbollist'];

                const symbolName = newSymbolList[0][1];
                // console.log('symbollist'+newSymbolList);

                const tradeArray = newSymbolList[0].slice(1);

                setTotalSubscribed(response['totalsymbolsubscribed']);

                setSymbolIdName(prevData => {
                    const updatedMap = { ...prevData };
                    newSymbolList.forEach(item => {
                        const name = item[0];
                        const id = item[1];
                        updatedMap[id] = name;
                    });
                    return updatedMap;
                });

                setTradeData(prev => ({
                    ...prev,
                    [symbolName]: {
                        data: tradeArray,
                        bgcolor: 'white'
                    }
                }));
            }
        };


        ws.current.onclose = () => {
            console.log('WebSocket Disconnected');
        };

        ws.current.onerror = (error) => {
            console.error('WebSocket Error:', error);
        };

        return () => {
            ws.current.close();
        }
    }, []);


    const sendRequest = () => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            const reqMsg = {
                method: 'addsymbol',
                "symbols": symbols
            }
            ws.current.send(JSON.stringify(reqMsg))
        } else {
            console.log('WebSocket is not Open.');
        }
    }

    const onUnsubscribe = (symbolName, symbolId) => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            const reqMsg = {
                method: 'removesymbol',
                "symbols": [symbolName]
            }
            setTotalSubscribed(prev => prev - 1);
            symbolIdName[symbolId] && delete symbolIdName[symbolId];
            symbols.splice(symbols.indexOf(symbolName), 1);
            setTradeData(prevData => {
                const updatedData = { ...prevData };
                delete updatedData[symbolId];
                return updatedData;
            })
            ws.current.send(JSON.stringify(reqMsg))

        } else {
            console.log('WebSocket is not Open.');
        }
    }

    return <div className="main-container">
        <input name="symbol" onChange={(e) => {
            setSymbol(e.target.value.toUpperCase())
        }} placeholder="Search any Symbol.." className="search-box" />
        <button onClick={() => {
            setSymbols([...symbols, symbol])
        }}
            className="subscribe-btn">Subscribe</button>

        <table border={1} className="trade-table">
            <tr>
                <th>Symbol</th>
                <th>Symbol ID</th>
                <th>Date Time (Timestamp)</th>
                <th>LTP</th>
                <th>ATP</th>
                <th>TTQ</th>
                <th>Open</th>
                <th>High</th>
                <th>Low</th>
                <th>Prev Close</th>
                <th>OI</th>
                {/* <th>Prev OI Close</th> */}
                {/* <th>Day's Turnover</th> */}
                <th>Special Tag</th>
                {/* <th>Tick Seq No</th> */}
                <th>Bid</th>
                <th>Bid Qty</th>
                <th>Ask</th>
                <th>Ask Qty</th>
                <th>Action</th>
            </tr>
            {Object.keys(tradeData).length === 0 ? (
                <tr>
                    <td colSpan={17} className="no-data">
                        No data available. Please subscribe to a symbol.
                    </td>
                </tr>
            ) : (
                Object.values(tradeData).map((item) => {
                    const i = item.data;
                    const color = item.bgcolor;
                    const symbolNameKey = i[0];
                    const symbolName = symbolIdName[symbolNameKey] || symbolNameKey;

                    return (
                        <tr
                            key={symbolNameKey}
                            className={
                                color === "green"
                                    ? "price-up"
                                    : color === "red"
                                        ? "price-down"
                                        : "price-neutral"
                            }
                        >
                            <td>{symbolName}</td>
                            <td>{i[0]}</td>
                            <td>{i[1]}</td>
                            <td>{i[2]}</td>
                            <td>{i[3]}</td>
                            <td>{i[4]}</td>
                            <td>{i[5]}</td>
                            <td>{i[6]}</td>
                            <td>{i[7]}</td>
                            <td>{i[8]}</td>
                            <td>{i[9]}</td>
                            <td>{i[12]}</td>
                            <td>{i[14]}</td>
                            <td>{i[15]}</td>
                            <td>{i[16]}</td>
                            <td>{i[17]}</td>
                            <td>
                                <button
                                    className="unsubscribe-btn"
                                    onClick={() => onUnsubscribe(symbolName, symbolNameKey)}
                                >
                                    Unsubscribe
                                </button>
                            </td>
                        </tr>
                    );
                })
            )}

        </table>

        <h3 className="total-subscribed">Total Subscribed Symbols: {totalSubscribed}</h3>
    </div>
}