import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Attendance from './pages/Attendance';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1c1c22',
            color: '#e8e8f0',
            border: '1px solid #2a2a35',
            fontFamily: "'Syne', sans-serif",
            fontSize: '0.85rem',
          },
          success: { iconTheme: { primary: '#3ecf8e', secondary: '#0c0c0f' } },
          error:   { iconTheme: { primary: '#f56565', secondary: '#0c0c0f' } },
        }}
      />

      <div className="app-shell">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/attendance" element={<Attendance />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
