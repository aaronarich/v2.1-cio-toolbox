import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import HelloWorld from './pages/HelloWorld';
import { trackPage } from './utils/sdk';
import './App.css';

function RoutePageTracker() {
  const location = useLocation();

  React.useEffect(() => {
    trackPage();
  }, [location.pathname, location.search, location.hash]);

  return null;
}

function App() {
  return (
    <Router>
      <RoutePageTracker />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hello-world" element={<HelloWorld />} />
      </Routes>
    </Router>
  );
}

export default App;
