import { useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import { employeeApi } from '../api';
import AddEmployeeModal from '../components/AddEmployeeModal';
import ConfirmDialog from '../components/ConfirmDialog';
import MarkAttendanceModal from '../components/MarkAttendanceModal';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function Employees() {
  const { data: employees, loading, error, refetch } = useFetch(employeeApi.list);
  const [showAdd, setShowAdd] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [attendanceFor, setAttendanceFor] = useState(null);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');

  const filtered = (employees || []).filter((e) => {
    const q = search.toLowerCase();
    const matchSearch = !q || e.full_name.toLowerCase().includes(q) ||
      e.employee_id.toLowerCase().includes(q) || e.email.toLowerCase().includes(q);
    const matchDept = !deptFilter || e.department === deptFilter;
    return matchSearch && matchDept;
  });

  const departments = [...new Set((employees || []).map(e => e.department))].sort();

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await employeeApi.delete(deleteTarget.id);
      toast.success(`"${deleteTarget.full_name}" removed`);
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
          <div className="page-title">Employees</div>
          <div className="page-sub">{employees?.length ?? 0} total records</div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
          + Add Employee
        </button>
      </div>

      <div className="page-body">
        <div className="card">
          {/* Filters */}
          <div className="filter-bar">
            <input
              placeholder="Search by name, ID or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ flex: 1, minWidth: 180 }}
            />
            <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} style={{ width: 170 }}>
              <option value="">All Departments</option>
              {departments.map(d => <option key={d}>{d}</option>)}
            </select>
            {(search || deptFilter) && (
              <button className="btn btn-ghost btn-sm" onClick={() => { setSearch(''); setDeptFilter(''); }}>
                Clear
              </button>
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
          ) : !filtered.length ? (
            <div className="state-box">
              <div className="state-icon">⬡</div>
              <div className="state-title">{search || deptFilter ? 'No results found' : 'No employees yet'}</div>
              <div className="state-sub">
                {search || deptFilter ? 'Try adjusting your filters' : 'Click "Add Employee" to get started'}
              </div>
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Employee ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Department</th>
                    <th>Present</th>
                    <th>Absent</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((emp) => (
                    <tr key={emp.id}>
                      <td><span className="emp-id-badge">{emp.employee_id}</span></td>
                      <td style={{ fontWeight: 600 }}>{emp.full_name}</td>
                      <td style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>{emp.email}</td>
                      <td><span className="badge badge-dept">{emp.department}</span></td>
                      <td>
                        <span style={{ color: 'var(--green)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                          {emp.total_present}
                        </span>
                      </td>
                      <td>
                        <span style={{ color: 'var(--red)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                          {emp.total_absent}
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                        {format(new Date(emp.created_at), 'MMM d, yyyy')}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => setAttendanceFor(emp.id)}
                            title="Mark attendance"
                          >
                            ✓ Attend
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => setDeleteTarget(emp)}
                            title="Delete employee"
                          >
                            ✕
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showAdd && (
        <AddEmployeeModal onClose={() => setShowAdd(false)} onSuccess={refetch} />
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete Employee"
          message={`Are you sure you want to delete "${deleteTarget.full_name}"? All attendance records will also be removed.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleteLoading}
        />
      )}

      {attendanceFor && (
        <MarkAttendanceModal
          employees={employees || []}
          prefillEmployee={attendanceFor}
          onClose={() => setAttendanceFor(null)}
          onSuccess={() => {}}
        />
      )}
    </div>
  );
}
