import { useFetch } from '../hooks/useFetch';
import { employeeApi } from '../api';
import { format } from 'date-fns';

export default function Dashboard() {
  const { data: stats, loading, error } = useFetch(employeeApi.dashboard);

  if (loading) return (
    <div className="state-box">
      <span className="spinner" style={{ width: 32, height: 32 }} />
      <span className="state-sub">Loading dashboard…</span>
    </div>
  );

  if (error) return (
    <div className="state-box">
      <div className="state-icon">⚠</div>
      <div className="state-title">Failed to load</div>
      <div className="state-sub">{error}</div>
    </div>
  );

  const maxDept = Math.max(...(stats?.departments?.map(d => d.count) || [1]), 1);

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <div className="page-title">Dashboard</div>
          <div className="page-sub">{format(new Date(), 'EEEE, MMMM d yyyy')}</div>
        </div>
      </div>

      <div className="page-body">
        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card accent">
            <span className="stat-icon">⬡</span>
            <div className="stat-value">{stats?.total_employees ?? 0}</div>
            <div className="stat-label">Total Employees</div>
          </div>
          <div className="stat-card green">
            <span className="stat-icon">✓</span>
            <div className="stat-value" style={{ color: 'var(--green)' }}>{stats?.present_today ?? 0}</div>
            <div className="stat-label">Present Today</div>
          </div>
          <div className="stat-card red">
            <span className="stat-icon">✕</span>
            <div className="stat-value" style={{ color: 'var(--red)' }}>{stats?.absent_today ?? 0}</div>
            <div className="stat-label">Absent Today</div>
          </div>
          <div className="stat-card yellow">
            <span className="stat-icon">◷</span>
            <div className="stat-value" style={{ color: 'var(--yellow)' }}>{stats?.total_attendance_records ?? 0}</div>
            <div className="stat-label">Total Records</div>
          </div>
        </div>

        {/* Dept breakdown */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Department Breakdown</span>
            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
              {stats?.total_employees} employees
            </span>
          </div>
          <div className="card-body">
            {!stats?.departments?.length ? (
              <div className="state-box" style={{ padding: '24px' }}>
                <div className="state-sub">No departments yet</div>
              </div>
            ) : (
              stats.departments.map((d) => (
                <div key={d.department} className="dept-bar-row">
                  <span className="dept-bar-label">{d.department}</span>
                  <div className="dept-bar-track">
                    <div
                      className="dept-bar-fill"
                      style={{ width: `${(d.count / maxDept) * 100}%` }}
                    />
                  </div>
                  <span className="dept-bar-count">{d.count}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
