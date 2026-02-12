import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import HelloWorld from './pages/HelloWorld';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hello-world" element={<HelloWorld />} />
      </Routes>
    </Router>
  );
}

export default App;
