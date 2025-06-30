import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import SalasPage from './pages/SalasPage';
import ReservarPage from './pages/ReservarPage';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<SalasPage />} />
        <Route path="/reservar" element={<ReservarPage />} />
      </Routes>
    </Layout>
  );
}

export default App;