export default function TradeTable({ tradeData = {}, onUnsubscribe, symbolIdName = {}, symbols = [] }) {

    return <div>
        <table className="trade-table">
            <thead>
                <tr>
                    <th>Symbol</th>
                    <th>Symbol ID</th>
                    <th>Date Time (Timestamp)</th>
                    <th style={{ minWidth: '100px' }}>LTP</th>
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
            </thead>
            <tbody>
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
                                <td style={{ fontWeight: 500 }} className="lt-cell">{i[3]}</td>
                                <td style={{ fontWeight: 500 }} className="lt-cell">{i[4]}</td>
                                <td className="lt-cell">{i[5]}</td>
                                <td className="lt-cell">{i[6]}</td>
                                <td style={{ color: 'red' }} className="lt-cell">{i[7]}</td>
                                <td style={{ color: 'green' }} className="lt-cell">{i[8]}</td>
                                <td className="lt-cell">{i[9]}</td>
                                <td className="lt-cell">{i[10]}</td>
                                <td className="lt-cell">{i[11]}</td>
                                <td className="lt-cell">{i[12]}</td>
                                {/* <td>{i[13] && '-'}</td> */}
                                <td className="lt-cell">{i[14]}</td>
                                <td className="lt-cell">{i[15]}</td>
                                <td className="lt-cell">{i[16]}</td>
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
            </tbody>
        </table>
    </div>
}