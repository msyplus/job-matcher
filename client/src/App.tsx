import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/auth';
import Layout from './components/Layout/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Experience from './pages/Experience';
import JDMatch from './pages/JDMatch';
import ResumeEditor from './pages/ResumeEditor';
import Tracking from './pages/Tracking';
import Feedback from './pages/Feedback';
import Admin from './pages/Admin';
import Recommend from './pages/Recommend';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { token, guestReady } = useAuthStore();
  if (!guestReady) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="text-gray-400">加载中...</div></div>;
  if (!token) return <Navigate to="/login" />;
  return <>{children}</>;
}

function App() {
  const init = useAuthStore((s) => s.init);

  useEffect(() => {
    init();
  }, []);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/*"
        element={
          <PrivateRoute>
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/experience" element={<Experience />} />
                <Route path="/jd-match" element={<JDMatch />} />
                <Route path="/resume/:id?" element={<ResumeEditor />} />
                <Route path="/tracking" element={<Tracking />} />
                <Route path="/feedback" element={<Feedback />} />
                <Route path="/recommend" element={<Recommend />} />
                <Route path="/admin" element={<Admin />} />
              </Routes>
            </Layout>
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;
