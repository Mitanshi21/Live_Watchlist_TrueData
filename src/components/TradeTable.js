export default function TradeTable({ tradeData = {}, onUnsubscribe, symbolIdName = {}, symbols=[] }) {

    return <div>
        <table className="trade-table">
            <tr>
                <th>Symbol</th>
                <th>Symbol ID</th>
                <th>Date Time (Timestamp)</th>
                <th style={{minWidth:'100px'}}>LTP</th>
                <th>LTQ</th>
                <th>ATP</th>
                <th>TTQ</th>
                <th>Open</th>
                <th>High</th>
                <th>Low</th>
                <th>Prev Close</th>
                <th>OI</th>
                <th>Prev OI Close</th>
                <th>Day's Turnover</th>
                {/* <th>Special Tag</th> */}
                <th>Tick Seq No</th>
                <th>Bid</th>
                <th>Bid Qty</th>
                <th>Ask</th>
                <th>Action</th>
                {/* <th>Action</th> */}
            </tr>
            {Object.keys(tradeData).length === 0 ? (
                <tr>
                    <td colSpan={20} className="no-data">
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

                        >
                            <td>{symbolName}</td>
                            <td>{i[0]}</td>
                            <td>{i[1]}</td>
                            <td className={
                                color === "green"
                                    ? "lt-cell price-up"
                                    : color === "red"
                                        ? "lt-cell price-down"
                                        : "lt-cell price-neutral"
                            }>{i[2]}</td>
                            <td style={{fontWeight:500}}>{i[3]}</td>
                            <td style={{fontWeight:500}}>{i[4]}</td>
                            <td>{i[5]}</td>
                            <td>{i[6]}</td>
                            <td style={{color:'red'}}>{i[7]}</td>
                            <td  style={{color:'green'}}>{i[8]}</td>
                            <td>{i[9]}</td>
                            <td>{i[10]}</td>
                            <td>{i[11]}</td>
                            <td>{i[12]}</td>
                            {/* <td>{i[13] && '-'}</td> */}
                            <td>{i[14]}</td>
                            <td>{i[15]}</td>
                            <td>{i[16]}</td>
                            <td>{i[17] && '-'}</td>
                            <td>
                                <button
                                    className="unsubscribe-btn"
                                    onClick={() => onUnsubscribe(symbolName, symbolNameKey, symbols)}
                                >
                                    Unsubscribe
                                </button>
                            </td>
                        </tr>
                    );
                })
            )}

        </table>
    </div>
}