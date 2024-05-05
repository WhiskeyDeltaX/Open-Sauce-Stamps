import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss';

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserDataProvider } from './contexts/UserDataContext';
import LoginPage from './components/LoginPage';
import StampPage from './components/StampPage';
import CollectStampPage from './components/CollectStampPage';

function App() {
  return (<div className="App">
    <UserDataProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/stamps" element={<StampPage />} />
          <Route path="/collect/:uuid" element={<CollectStampPage />} />
        </Routes>
      </Router>
    </UserDataProvider>
  </div>
    
  );
}

export default App;
