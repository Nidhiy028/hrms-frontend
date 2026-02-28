import { useState } from 'react';
import Modal from './Modal';
import { employeeApi } from '../api';
import toast from 'react-hot-toast';

const DEPARTMENTS = [
  'Engineering', 'Product', 'Design', 'Marketing',
  'Sales', 'HR', 'Finance', 'Operations', 'Legal', 'Other'
];

const empty = { employee_id: '', full_name: '', email: '', department: '' };

export default function AddEmployeeModal({ onClose, onSuccess }) {
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async () => {
    if (!form.employee_id || !form.full_name || !form.email || !form.department) {
      toast.error('All fields are required.');
      return;
    }
    setLoading(true);
    try {
      await employeeApi.create(form);
      toast.success(`Employee "${form.full_name}" added!`);
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Add New Employee" onClose={onClose}>
      <div className="modal-body">
        <div className="form-grid">
          <div className="form-group">
            <label>Employee ID</label>
            <input placeholder="e.g. EMP-001" value={form.employee_id} onChange={set('employee_id')} />
          </div>
          <div className="form-group">
            <label>Full Name</label>
            <input placeholder="Jane Smith" value={form.full_name} onChange={set('full_name')} />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" placeholder="jane@company.com" value={form.email} onChange={set('email')} />
          </div>
          <div className="form-group">
            <label>Department</label>
            <select value={form.department} onChange={set('department')}>
              <option value="">— Select Department —</option>
              {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div className="form-actions">
            <button className="btn btn-ghost" onClick={onClose} disabled={loading}>Cancel</button>
            <button className="btn btn-primary" onClick={submit} disabled={loading}>
              {loading ? <><span className="spinner" /> Saving…</> : '+ Add Employee'}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
