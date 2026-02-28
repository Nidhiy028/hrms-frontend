import Modal from './Modal';

export default function ConfirmDialog({ title, message, onConfirm, onCancel, loading }) {
  return (
    <Modal title={title} onClose={onCancel}>
      <div className="confirm-body">
        <p>{message}</p>
        <div className="confirm-actions">
          <button className="btn btn-ghost" onClick={onCancel} disabled={loading}>Cancel</button>
          <button className="btn btn-danger" onClick={onConfirm} disabled={loading}>
            {loading ? <span className="spinner" /> : 'Delete'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
