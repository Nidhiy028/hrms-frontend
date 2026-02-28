const BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    // FastAPI validation errors come as array
    if (data.detail && Array.isArray(data.detail)) {
      const msg = data.detail.map(e => `${e.loc?.slice(-1)[0]}: ${e.msg}`).join(', ');
      throw new Error(msg);
    }
    throw new Error(data.detail || `Request failed (${res.status})`);
  }

  return data;
}

// ── Employees ──────────────────────────────────────────────
export const employeeApi = {
  list: () => request('/api/employees/'),

  get: (id) => request(`/api/employees/${id}`),

  create: (payload) =>
    request('/api/employees/', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  delete: (id) =>
    request(`/api/employees/${id}`, { method: 'DELETE' }),

  dashboard: () => request('/api/employees/dashboard/stats'),
};

// ── Attendance ─────────────────────────────────────────────
export const attendanceApi = {
  list: (params = {}) => {
    const qs = new URLSearchParams();
    if (params.employee_id) qs.set('employee_id', params.employee_id);
    if (params.date) qs.set('date', params.date);
    return request(`/api/attendance/?${qs.toString()}`);
  },

  mark: (payload) =>
    request('/api/attendance/', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  delete: (id) =>
    request(`/api/attendance/${id}`, { method: 'DELETE' }),
};
