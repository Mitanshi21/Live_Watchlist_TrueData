import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css';
import 'dockview/dist/styles/dockview.css';
import MainList from './pages/MainList';
import Login from './components/Login';
import { useEffect, useState } from 'react';
import useTradeSocket from './hooks/useTradeSocket';
import WatchList from './pages/WatchList';
import ProtectedRoute from './routes/ProtectedRoute';

function App() {
  const [criedential, setCriedential] = useState(null)
  // Add a loading state to block rendering until we check localStorage
  const [isAuthLoaded, setIsAuthLoaded] = useState(false);

  const trade = useTradeSocket(criedential);

  const handleLogout = () => {
    trade.onLogout()
    setCriedential(null)
    
    localStorage.clear(); // Optional: Ensure storage is cleared on logout
  }

  useEffect(() => {
    const savedUser = localStorage.getItem("username");
    const savedPass = localStorage.getItem("password");

    if (savedUser && savedPass) {
      setCriedential({ username: savedUser, password: savedPass });
    }
    
    // Mark the check as complete
    setIsAuthLoaded(true);
  }, []);

  // Prevent the router from rendering until we know if the user is logged in or not
  if (!isAuthLoaded) {
    return <div>Loading Application...</div>; 
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
              <ProtectedRoute credential={criedential} trade={trade}>
                <MainList
                  tradeData={trade.tradeData}
                  totalSubscribed={trade.totalSubscribed}
                  sendRequest={trade.sendRequest}
                  onUnsubscribe={trade.onUnsubscribe}
                  symbolIdName={trade.symbolIdName}
                  onLogout={handleLogout}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/watchList"
            element={
              <ProtectedRoute credential={criedential} trade={trade}>
                <WatchList
                  tradeData={trade.tradeData}
                  totalSubscribed={trade.totalSubscribed}
                  sendRequest={trade.sendRequest}
                  onUnsubscribe={trade.onUnsubscribe}
                  symbolIdName={trade.symbolIdName}
                  onLogout={handleLogout}
                />
              </ProtectedRoute>
            }
          />

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;