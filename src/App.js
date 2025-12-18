import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css';
import MainList from './pages/MainList';
import Login from './components/Login';
import { useEffect, useState } from 'react';
import useTradeSocket from './hooks/useTradeSocket';

function App() {
  const [criedential, setCriedential] = useState(null)

  const trade = useTradeSocket(criedential);

  const handleLogout = () =>{
    trade.onLogout()
    setCriedential(null)
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={
            <Login onSuccess={(u, p) =>
              setCriedential({ username: u, password: p })
            }
              error={trade.authMessage}
            />} />

          <Route
            path="/mainList"
            element={
              !criedential ? (
                <Navigate to="/" replace />
              ) : trade.authMessage ? (
                <Navigate to="/" replace />
              ) : trade.isConnected ? (
                <MainList
                  tradeData={trade.tradeData}
                  totalSubscribed={trade.totalSubscribed}
                  sendRequest={trade.sendRequest}
                  onUnsubscribe={trade.onUnsubscribe}
                  symbolIdName={trade.symbolIdName}
                  onLogout={handleLogout}
                />
              ) : (
                // 4️⃣ Connecting
                <h3>Connecting to WebSocket...</h3>
              )
            }
          />


        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
