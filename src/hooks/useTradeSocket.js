import { useEffect, useRef, useState } from "react"
import { flushSync } from "react-dom";

export default function useTradeSocket(criedential) {
    const ws = useRef(null);
    const [tradeData, setTradeData] = useState({});
    const [totalSubscribed, setTotalSubscribed] = useState(0);
    const [symbolIdName, setSymbolIdName] = useState({});
    const [isConnected, setIsConnected] = useState(false);

    const [authMessage, setAuthMessage] = useState();


    useEffect(() => {
        setAuthMessage("")
        if (!criedential?.username || !criedential?.password) {
            return;
        } else {
            const url = `wss://push.truedata.in:8082?user=${criedential.username}&password=${criedential.password}`
            ws.current = new WebSocket(url);

            ws.current.onopen = () => {
                console.log("Web Socket is Connected!");
                setIsConnected(true)
            }

            ws.current.onmessage = (e) => {
                const response = JSON.parse(e.data);
                console.log(response);

                if (response['message'] === "Invalid User Credentials") {
                    setAuthMessage("Invalid Username or Password!!")
                    setIsConnected(false)
                }else{
                    localStorage.setItem('username',criedential.username)
                    localStorage.setItem('password',criedential.password)
                }

                if (response['trade']) {
                    setIsConnected(true)
                    setAuthMessage('')
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
                    setIsConnected(true)
                    setAuthMessage('')
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
                // setAuthMessage('Invalid UserName or Password..')
                setIsConnected(false)
                console.log('WebSocket Disconnected');
            };

            ws.current.onerror = (error) => {
                setIsConnected(true)
                setAuthMessage('')
                console.error('WebSocket Error:', error);
            };

            return () => {
                setIsConnected(false)
                ws.current.close();
            }
        }

    }, [criedential]);

    const sendRequest = (symbols) => {
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

    const onUnsubscribe = (symbolName, symbolId, symbols) => {
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

    const onLogout = () =>{
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            const reqMsg = {
                method:'logout'
            }
            ws.current.send(JSON.stringify(reqMsg))

            localStorage.removeItem('password')
            setIsConnected(false)
            setAuthMessage("")
            setTradeData({})
            setTotalSubscribed(0)
            setSymbolIdName({})
        }else{
            console.log('WebSocket is not Open.');
        }
    }

    return { tradeData, totalSubscribed, sendRequest, onUnsubscribe, symbolIdName, isConnected, authMessage, onLogout }
}