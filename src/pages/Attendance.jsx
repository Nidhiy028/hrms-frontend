import { useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import { employeeApi, attendanceApi } from '../api';
import MarkAttendanceModal from '../components/MarkAttendanceModal';
import ConfirmDialog from '../components/ConfirmDialog';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function Attendance() {
  const [filters, setFilters] = useState({ employee_id: '', date: '' });
  const [applied, setApplied] = useState({});
  const [showMark, setShowMark] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { data: employees } = useFetch(employeeApi.list);
  const { data: records, loading, error, refetch } = useFetch(
    () => attendanceApi.list(applied),
    [JSON.stringify(applied)]
  );

  const applyFilters = () => setApplied({ ...filters });
  const clearFilters = () => { setFilters({ employee_id: '', date: '' }); setApplied({}); };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await attendanceApi.delete(deleteTarget.id);
      toast.success('Attendance record deleted');
      setDeleteTarget(null);
      refetch();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <div className="page-title">Attendance</div>
          <div className="page-sub">{records?.length ?? 0} records shown</div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowMark(true)}>
          ✓ Mark Attendance
        </button>
      </div>

      <div className="page-body">
        <div className="card">
          {/* Filter Bar */}
          <div className="filter-bar">
            <select
              value={filters.employee_id}
              onChange={(e) => setFilters(f => ({ ...f, employee_id: e.target.value }))}
              style={{ width: 220 }}
            >
              <option value="">All Employees</option>
              {(employees || []).map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.employee_id} — {emp.full_name}
                </option>
              ))}
            </select>
            <input
              type="date"
              value={filters.date}
              onChange={(e) => setFilters(f => ({ ...f, date: e.target.value }))}
              style={{ width: 160 }}
            />
            <button className="btn btn-primary btn-sm" onClick={applyFilters}>Apply</button>
            {(applied.employee_id || applied.date) && (
              <button className="btn btn-ghost btn-sm" onClick={clearFilters}>Clear</button>
            )}
          </div>

          {/* Table */}
          {loading ? (
            <div className="state-box"><span className="spinner" /></div>
          ) : error ? (
            <div className="state-box">
              <div className="state-icon">⚠</div>
              <div className="state-title">Failed to load</div>
              <div className="state-sub">{error}</div>
            </div>
          ) : !records?.length ? (
            <div className="state-box">
              <div className="state-icon">◷</div>
              <div className="state-title">No attendance records</div>
              <div className="state-sub">
                {applied.employee_id || applied.date
                  ? 'No records match your filters'
                  : 'Start marking attendance using the button above'}
              </div>
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Employee ID</th>
                    <th>Name</th>
                    <th>Date</th>
                    <th>Day</th>
                    <th>Status</th>
                    <th>Marked At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((rec, idx) => (
                    <tr key={rec.id}>
                      <td style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
                        {idx + 1}
                      </td>
                      <td>
                        <span className="emp-id-badge">{rec.employee_code}</span>
                      </td>
                      <td style={{ fontWeight: 600 }}>{rec.employee_name}</td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>
                        {format(new Date(rec.date), 'MMM d, yyyy')}
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                        {format(new Date(rec.date), 'EEEE')}
                      </td>
                      <td>
                        <span className={`badge ${rec.status === 'Present' ? 'badge-present' : 'badge-absent'}`}>
                          {rec.status === 'Present' ? '● Present' : '○ Absent'}
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                        {format(new Date(rec.created_at), 'MMM d, HH:mm')}
                      </td>
                      <td>
                        <button
                          className="btn btn-danger btn-sm btn-icon"
                          onClick={() => setDeleteTarget(rec)}
                          title="Delete record"
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Summary by employee if no employee filter */}
        {!applied.employee_id && records?.length > 0 && (
          <div className="card" style={{ marginTop: 20 }}>
            <div className="card-header">
              <span className="card-title">Summary by Employee</span>
            </div>
            <div className="card-body">
              {Object.values(
                records.reduce((acc, rec) => {
                  if (!acc[rec.employee_code]) {
                    acc[rec.employee_code] = {
                      code: rec.employee_code,
                      name: rec.employee_name,
                      present: 0,
                      absent: 0,
                    };
                  }
                  if (rec.status === 'Present') acc[rec.employee_code].present++;
                  else acc[rec.employee_code].absent++;
                  return acc;
                }, {})
              ).map((s) => (
                <div key={s.code} style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12, flexWrap: 'wrap' }}>
                  <span className="emp-id-badge">{s.code}</span>
                  <span style={{ fontWeight: 600, minWidth: 140 }}>{s.name}</span>
                  <span style={{ color: 'var(--green)', fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>
                    ✓ {s.present} present
                  </span>
                  <span style={{ color: 'var(--red)', fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>
                    ✕ {s.absent} absent
                  </span>
                  <span style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>
                    {s.present + s.absent} total
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showMark && (
        <MarkAttendanceModal
          employees={employees || []}
          onClose={() => setShowMark(false)}
          onSuccess={refetch}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete Record"
          message={`Remove attendance record for "${deleteTarget.employee_name}" on ${format(new Date(deleteTarget.date), 'MMM d, yyyy')}?`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleteLoading}
        />
      )}
    </div>
  );
}
