import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import api from '../../lib/api';
import Pagination from '../../components/Pagination';
import { PageSpinner } from '../../components/Spinner';

export default function AdminUsers() {
  const [users, setUsers]         = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [roleFilter, setRoleFilter] = useState('customer');
  const [page, setPage]           = useState(1);

  const fetch = (p = 1, role = roleFilter, q = search) => {
    setLoading(true);
    const params = new URLSearchParams({ page: p, limit: 15 });
    if (role) params.append('role', role);
    if (q)    params.append('search', q);
    api.get(`/admin/users?${params}`)
      .then(r => { setUsers(r.data.data || []); setPagination(r.data.pagination); })
      .catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetch(1, roleFilter, search); setPage(1); }, [roleFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetch(1, roleFilter, search);
  };

  const toggleStatus = async (user) => {
    try {
      await api.put(`/admin/users/${user.id}/status`, { isActive: !user.isActive });
      toast.success(`User ${!user.isActive ? 'activated' : 'deactivated'}`);
      fetch(page, roleFilter, search);
    } catch (err) { toast.error(err.response?.data?.error || 'Failed'); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Users</h1>
        <p className="text-slate-400 mt-1">{pagination?.total ?? 0} found</p>
      </div>

      <div className="flex gap-3 flex-wrap">
        <form onSubmit={handleSearch} className="flex gap-2 flex-1 min-w-[240px]">
          <input className="input-field flex-1" placeholder="Search by name or email…"
            value={search} onChange={e => setSearch(e.target.value)} />
          <button type="submit" className="btn-secondary px-4">Search</button>
        </form>
        <div className="flex gap-2">
          {['customer', 'technician', ''].map(r => (
            <button key={r} onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${roleFilter === r ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
              {r === '' ? 'All' : r}
            </button>
          ))}
        </div>
      </div>

      {loading ? <PageSpinner /> : (
        <>
          <div className="card overflow-x-auto p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-500 text-xs uppercase border-b border-slate-800">
                  {['Name','Email','Role','Verified','Status','Joined','Action'].map(h => (
                    <th key={h} className="text-left px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-slate-800/40">
                    <td className="px-4 py-3 font-medium text-white">{u.name}</td>
                    <td className="px-4 py-3 text-slate-400 text-xs">{u.email}</td>
                    <td className="px-4 py-3 text-slate-400 capitalize">{u.role}</td>
                    <td className="px-4 py-3">{u.isVerified ? <span className="text-green-400 text-xs">✅ Yes</span> : <span className="text-yellow-400 text-xs">⚠ No</span>}</td>
                    <td className="px-4 py-3">{u.isActive ? <span className="text-green-400 text-xs">Active</span> : <span className="text-red-400 text-xs">Inactive</span>}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      {u.role !== 'admin' && (
                        <button onClick={() => toggleStatus(u)}
                          className={`text-xs px-2 py-1 rounded ${u.isActive ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'}`}>
                          {u.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination pagination={pagination} onPageChange={(p) => { setPage(p); fetch(p, roleFilter, search); }} />
        </>
      )}
    </div>
  );
}
