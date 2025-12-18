import { useState } from "react";

export default function Search({allSymbols=[], onAddSymbol}) {
    const [search, setSearch] = useState("")
    const [showDropdown, setShowDropdown] = useState()
    const filteredSymbols = allSymbols
        .filter(sym =>
            sym.toLowerCase().includes(search.toLowerCase())
        )
        .slice(0, 30);

    const handleAdd = () =>{
        if(!search)
            return
        onAddSymbol(search)
        setSearch("")
        setShowDropdown(false)
    }
    return <>
        <div className="watchlist-toolbar">
            <div className="symbol-search-wrapper">
                <input
                    type="text"
                    placeholder="Search symbol (e.g. RELIANCE)"
                    value={search}
                    className="search-input"
                    onChange={(e) => {
                        setSearch(e.target.value.toUpperCase());
                        setShowDropdown(true);
                    }}
                    onFocus={() => setShowDropdown(true)}
                />

                {showDropdown && search && (
                    <div className="dropdown">
                        {filteredSymbols.length === 0 ? (
                            <div className="dropdown-item disabled">
                                No Results
                            </div>
                        ) : (
                            filteredSymbols.map((sym, index) => (
                                <div
                                    key={index}
                                    className="dropdown-item"
                                    onClick={() => {
                                        setSearch(sym);
                                        setShowDropdown(false);
                                    }}
                                >
                                    {sym}
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

            <button
                className="add-btn"
                onClick={handleAdd}
            >
                + Add
            </button>
        </div>
    </>
}