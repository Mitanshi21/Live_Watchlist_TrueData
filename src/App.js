import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css';
import MainList from './MainList';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<MainList/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
