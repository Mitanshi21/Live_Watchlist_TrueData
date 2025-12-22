export default function WatchlistTable({ tradeData = {}, onUnsubscribe, symbolIdName = {}, symbols = [] }) {

    const formatPrice = (price) => {
        if (!price) return "0.00";
        return parseFloat(price).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    return (
        <div className="watchlist-container" style={{ overflow: 'auto' }}>
            {Object.keys(tradeData).length === 0 ? (
                <div className="no-data">
                    <p>No symbols added.</p>
                    <small>Search and add symbols to start tracking.</small>
                </div>
            ) : (
                Object.values(tradeData).map((item) => {
                    const i = item.data;
                    const symbolNameKey = i[0];
                    const symbolName = symbolIdName[symbolNameKey] || symbolNameKey;

                    const volume = parseFloat(i[6] || 0)
                    const ltp = parseFloat(i[2] || 0);
                    const prevClose = parseFloat(i[9] || 0);

                    const change = ltp - prevClose;
                    const changePerc = prevClose !== 0 ? (change / prevClose) * 100 : 0;

                    const isPositive = change >= 0;
                    const colorClass = isPositive ? "text-green" : "text-red";
                    const sign = isPositive ? "+" : "";

                    return (
                        <div key={symbolNameKey} className="watchlist-row">

                            <div className="symbol-info">
                                <span className="symbol-name">{symbolName}</span>
                                <div className="symbol-meta">
                                    {/* <span className="exchange-tag">NSE</span> */}
                                    <span>{formatPrice(volume)}</span>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div className="price-info">
                                    <span className={`price-ltp ${colorClass}`}>
                                        {formatPrice(ltp)}
                                    </span>
                                    <span className={`price-change ${colorClass}`}>
                                        {sign}{change.toFixed(2)} ({changePerc.toFixed(2)}%)
                                    </span>
                                </div>

                                {/* HOVER ACTION: Delete Button */}
                                <div className="row-actions">
                                    <button
                                        className="btn-delete"
                                        title="Unsubscribe"
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevent row click
                                            onUnsubscribe(symbolName, symbolNameKey, symbols);
                                        }}
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="3 6 5 6 21 6"></polyline>
                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
}