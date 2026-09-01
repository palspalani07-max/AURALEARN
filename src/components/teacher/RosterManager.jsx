import { useState } from 'react';
import { UserPlus, Upload, Trash2, CheckCircle2, AlertCircle, FileSpreadsheet } from 'lucide-react';
import './RosterManager.css';

const INITIAL_ROSTER = [
  { id: 1, regNo: 'STU001', name: 'Alex Johnson', status: 'claimed', claimedAt: '2026-08-20' },
  { id: 2, regNo: 'STU002', name: 'Sarah Williams', status: 'claimed', claimedAt: '2026-08-22' },
  { id: 3, regNo: 'STU003', name: '—', status: 'unclaimed', claimedAt: null },
  { id: 4, regNo: 'STU004', name: '—', status: 'unclaimed', claimedAt: null },
];

export default function RosterManager() {
  const [roster, setRoster] = useState(INITIAL_ROSTER);
  const [singleRegNo, setSingleRegNo] = useState('');
  const [bulkText, setBulkText] = useState('');
  const [activeTab, setActiveTab] = useState('view'); // view | add | bulk
  const [message, setMessage] = useState(null);

  const handleAddSingle = (e) => {
    e.preventDefault();
    if (!singleRegNo.trim()) return;
    const cleanReg = singleRegNo.trim().toUpperCase();
    if (roster.some(r => r.regNo === cleanReg)) {
      setMessage({ type: 'error', text: `Registration number ${cleanReg} already exists on roster.` });
      return;
    }
    setRoster([
      ...roster,
      { id: Date.now(), regNo: cleanReg, name: '—', status: 'unclaimed', claimedAt: null }
    ]);
    setSingleRegNo('');
    setMessage({ type: 'success', text: `Added ${cleanReg} to class roster.` });
  };

  const handleAddBulk = (e) => {
    e.preventDefault();
    if (!bulkText.trim()) return;
    const regNos = bulkText
      .split(/[\n,;\s]+/)
      .map(r => r.trim().toUpperCase())
      .filter(r => r.length > 0);

    const newEntries = [];
    let addedCount = 0;

    regNos.forEach(reg => {
      if (!roster.some(r => r.regNo === reg) && !newEntries.some(r => r.regNo === reg)) {
        newEntries.push({ id: Date.now() + Math.random(), regNo: reg, name: '—', status: 'unclaimed', claimedAt: null });
        addedCount++;
      }
    });

    setRoster([...roster, ...newEntries]);
    setBulkText('');
    setActiveTab('view');
    setMessage({ type: 'success', text: `Bulk added ${addedCount} new registration numbers.` });
  };

  const handleDelete = (id) => {
    setRoster(roster.filter(r => r.id !== id));
    setMessage({ type: 'success', text: 'Removed entry from roster.' });
  };

  return (
    <div className="card animate-fade-in-up">
      <div className="card-header">
        <div>
          <h3 className="card-title">Class Roster Management</h3>
          <p className="card-subtitle">Approved registration numbers allowed to claim student accounts</p>
        </div>
        <div className="tabs">
          <button className={`tab ${activeTab === 'view' ? 'active' : ''}`} onClick={() => setActiveTab('view')}>View Roster ({roster.length})</button>
          <button className={`tab ${activeTab === 'add' ? 'active' : ''}`} onClick={() => setActiveTab('add')}>Add Single</button>
          <button className={`tab ${activeTab === 'bulk' ? 'active' : ''}`} onClick={() => setActiveTab('bulk')}>Bulk Add / CSV</button>
        </div>
      </div>

      {message && (
        <div className={`roster-alert roster-alert--${message.type} mb-4`}>
          {message.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{message.text}</span>
        </div>
      )}

      {activeTab === 'view' && (
        <div className="roster-table-container">
          <table className="roster-table">
            <thead>
              <tr>
                <th>Registration No</th>
                <th>Student Name</th>
                <th>Status</th>
                <th>Claimed Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {roster.map(entry => (
                <tr key={entry.id}>
                  <td className="font-semibold">{entry.regNo}</td>
                  <td>{entry.name}</td>
                  <td>
                    <span className={`badge badge-${entry.status === 'claimed' ? 'success' : 'warning'}`}>
                      {entry.status}
                    </span>
                  </td>
                  <td className="text-secondary text-sm">{entry.claimedAt || '—'}</td>
                  <td>
                    <button className="btn btn-ghost btn-sm text-danger" onClick={() => handleDelete(entry.id)}>
                      <Trash2 size={14} /> Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'add' && (
        <form className="roster-form" onSubmit={handleAddSingle}>
          <div className="input-group">
            <label className="input-label">Registration Number</label>
            <input
              type="text"
              className="input"
              placeholder="e.g. STU005"
              value={singleRegNo}
              onChange={e => setSingleRegNo(e.target.value)}
              autoFocus
            />
          </div>
          <button type="submit" className="btn btn-primary mt-4">
            <UserPlus size={16} /> Add to Roster
          </button>
        </form>
      )}

      {activeTab === 'bulk' && (
        <form className="roster-form" onSubmit={handleAddBulk}>
          <div className="input-group">
            <label className="input-label">Paste Registration Numbers (comma, space, or line separated)</label>
            <textarea
              className="input textarea"
              rows={5}
              placeholder="STU005&#10;STU006&#10;STU007"
              value={bulkText}
              onChange={e => setBulkText(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary mt-4">
            <FileSpreadsheet size={16} /> Process Bulk List
          </button>
        </form>
      )}
    </div>
  );
}
