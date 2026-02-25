import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import HelloWorld from './pages/HelloWorld';
import CioUtmTest from './pages/CioUtmTest';
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
        <Route path="/cio-utm-test" element={<CioUtmTest />} />
        <Route path="/cio-utm-test.html" element={<Navigate to="/cio-utm-test" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
