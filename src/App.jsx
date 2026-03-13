import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from './pages/Login';
import TeacherDashboard from './pages/teacher/Dashboard';
import AssignmentForm from './pages/teacher/AssignmentForm';
import Submissions from './pages/teacher/Submissions';
import StudentDashboard from './pages/student/Dashboard';
import SubmissionForm from './pages/student/SubmissionForm';

const ProtectedRoute = ({ children, allowedRole }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user?.role !== allowedRole) {
    return <Navigate to={`/${user?.role}`} replace />;
  }

  return children;
};

function App() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/" 
          element={
            isAuthenticated ? (
              <Navigate to={`/${user?.role}`} replace />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
        <Route 
          path="/login" 
          element={
            isAuthenticated ? <Navigate to={`/${user?.role}`} replace /> : <Login />
          } 
        />
        
        {/* Teacher Routes */}
        <Route
          path="/teacher/*"
          element={
            <ProtectedRoute allowedRole="teacher">
              <Routes>
                <Route path="/" element={<TeacherDashboard />} />
                <Route path="/assignments/new" element={<AssignmentForm />} />
                <Route path="/assignments/:id/edit" element={<AssignmentForm />} />
                <Route path="/assignments/:id/submissions" element={<Submissions />} />
              </Routes>
            </ProtectedRoute>
          }
        />

        {/* Student Routes */}
        <Route
          path="/student/*"
          element={
            <ProtectedRoute allowedRole="student">
              <Routes>
                <Route path="/" element={<StudentDashboard />} />
                <Route path="/assignments/:id" element={<SubmissionForm />} />
              </Routes>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
