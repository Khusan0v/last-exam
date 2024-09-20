import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Components/Header';
import './App.css';
import CoinsTable from './Components/pages/CoinsTable.jsx';
import SinglePage from './Components/pages/SinglePage.jsx';
import { CoinsProvider } from './context/CoinsContext.jsx'; 

function App() {
  return (
    <Router>
      <CoinsProvider>
        <div>
          <Header />
          <Routes>
            <Route path="/" element={<CoinsTable />} />
            <Route path="/coins" element={<CoinsTable />} />
            <Route path="/coins/:coinId" element={<SinglePage />} /> 
          </Routes>
        </div>
      </CoinsProvider>
    </Router>
  );
}

export default App;
