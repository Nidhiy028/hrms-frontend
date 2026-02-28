import { useState } from 'react';
import Modal from './Modal';
import { attendanceApi } from '../api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function MarkAttendanceModal({ employees, onClose, onSuccess, prefillEmployee = null }) {
  const today = format(new Date(), 'yyyy-MM-dd');
  const [form, setForm] = useState({
    employee_id: prefillEmployee ? String(prefillEmployee) : '',
    date: today,
    status: 'Present',
  });
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async () => {
    if (!form.employee_id || !form.date) {
      toast.error('Please fill all fields.');
      return;
    }
    setLoading(true);
    try {
      await attendanceApi.mark({
        employee_id: parseInt(form.employee_id),
        date: form.date,
        status: form.status,
      });
      toast.success(`Attendance marked as ${form.status}`);
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Mark Attendance" onClose={onClose}>
      <div className="modal-body">
        <div className="form-grid">
          <div className="form-group full">
            <label>Employee</label>
            <select value={form.employee_id} onChange={set('employee_id')}>
              <option value="">— Select Employee —</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.employee_id} — {emp.full_name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Date</label>
            <input type="date" value={form.date} onChange={set('date')} max={today} />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select value={form.status} onChange={set('status')}>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
            </select>
          </div>
          <div className="form-actions">
            <button className="btn btn-ghost" onClick={onClose} disabled={loading}>Cancel</button>
            <button className="btn btn-primary" onClick={submit} disabled={loading}>
              {loading ? <><span className="spinner" /> Saving…</> : '✓ Mark Attendance'}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
