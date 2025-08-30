import React, { useContext } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './auth/Login';
import Register from './auth/Register';
import PrivateRoute from './auth/PrivateRoute';
import DisasterMgmtDashboard from './dashboards/DisasterMgmtDashboard';
import GovtDashboard from './dashboards/GovtDashboard';
import NGODashboard from './dashboards/NGODashboard';
import FisherfolkDashboard from './dashboards/FisherfolkDashboard';
import CivilDefenceDashboard from './dashboards/CivilDefenceDashboard';
import Navbar from './components/Navbar';
import { AuthContext } from './auth/AuthContext';

const App = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const hideNavbar = location.pathname === '/login' || location.pathname === '/register';
  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Navigate to={user ? `/dashboard/${user.role.toLowerCase()}` : '/login'} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* <Route path="/dashboard/disaster" element={<PrivateRoute><DisasterMgmtDashboard /></PrivateRoute>} /> */}
        <Route path="/dashboard/disaster" element={<DisasterMgmtDashboard />} />
        <Route path="/dashboard/govt" element={<GovtDashboard />} />
        <Route path="/dashboard/ngo" element={<NGODashboard />} />
        <Route path="/dashboard/fisherfolk" element={<FisherfolkDashboard />} />
        <Route path="/dashboard/civildefence" element={<CivilDefenceDashboard />} />
        {/* <Route path="/dashboard/govt" element={<PrivateRoute><GovtDashboard /></PrivateRoute>} />
        <Route path="/dashboard/ngo" element={<PrivateRoute><NGODashboard /></PrivateRoute>} />
        <Route path="/dashboard/fisherfolk" element={<PrivateRoute><FisherfolkDashboard /></PrivateRoute>} />
        <Route path="/dashboard/civildefence" element={<PrivateRoute><CivilDefenceDashboard /></PrivateRoute>} /> */}
      </Routes>
    </>
  );
};

export default App;
