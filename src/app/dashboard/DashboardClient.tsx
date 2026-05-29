'use client';

import { useState } from 'react';
import { signOut } from 'next-auth/react';

type Feedback = {
  id: string;
  project_id: string;
  type: 'bug' | 'feature' | 'nps';
  message: string;
  nps_score: number | null;
  status: 'open' | 'in-progress' | 'resolved';
  created_at: string;
};

export default function DashboardClient({ initialFeedback }: { initialFeedback: Feedback[] }) {
  const [feedbackList, setFeedbackList] = useState<Feedback[]>(initialFeedback);
  const [filterType, setFilterType] = useState<string>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filteredFeedback = feedbackList.filter(f => filterType === 'all' || f.type === filterType);

  const updateStatus = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/feedback/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      
      const { data } = await res.json();
      setFeedbackList(prev => prev.map(f => f.id === id ? { ...f, status: data.status } : f));
    } catch (error) {
      console.error(error);
      alert('Error updating status');
    } finally {
      setUpdatingId(null);
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'bug': return 'bg-red-100 text-red-700 ring-red-600/20';
      case 'feature': return 'bg-purple-100 text-purple-700 ring-purple-600/20';
      case 'nps': return 'bg-green-100 text-green-700 ring-green-600/20';
      default: return 'bg-gray-100 text-gray-700 ring-gray-600/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-gray-100 text-gray-600';
      case 'in-progress': return 'bg-blue-100 text-blue-700';
      case 'resolved': return 'bg-emerald-100 text-emerald-700';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Toolbar */}
      <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white">
        <h2 className="text-lg font-semibold text-gray-900">Recent Feedback</h2>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <label htmlFor="filter" className="text-sm font-medium text-gray-500 whitespace-nowrap">Filter by type:</label>
            <select 
              id="filter"
              className="w-full sm:w-auto border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 py-2 px-3 bg-white outline-none transition-shadow"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Feedback</option>
              <option value="bug">Bug Reports</option>
              <option value="feature">Feature Requests</option>
              <option value="nps">NPS Scores</option>
            </select>
          </div>
          
          <button 
            onClick={() => signOut()}
            className="text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-gray-50/80 border-b border-gray-200">
              <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[10%]">Type</th>
              <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[15%]">Project</th>
              <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[45%]">Message</th>
              <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[15%]">Status</th>
              <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right w-[15%]">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {filteredFeedback.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-16 text-center">
                  <p className="text-gray-500 font-medium">No feedback entries found.</p>
                  <p className="text-gray-400 text-sm mt-1">Check back later or adjust your filters.</p>
                </td>
              </tr>
            ) : filteredFeedback.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="py-5 px-6 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset ${getBadgeColor(item.type)}`}>
                    {item.type === 'nps' ? 'NPS' : item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                  </span>
                </td>
                <td className="py-5 px-6 whitespace-nowrap text-sm text-gray-600 font-medium">
                  {item.project_id}
                </td>
                <td className="py-5 px-6">
                  <div className="text-sm text-gray-800 break-words line-clamp-2 leading-relaxed">
                    {item.type === 'nps' ? (
                      <span className="font-semibold text-gray-900 bg-gray-100 px-2 py-1 rounded">Score: {item.nps_score} / 10</span>
                    ) : (
                      item.message
                    )}
                  </div>
                </td>
                <td className="py-5 px-6 whitespace-nowrap">
                  <select 
                    disabled={updatingId === item.id}
                    value={item.status}
                    onChange={(e) => updateStatus(item.id, e.target.value)}
                    className={`text-xs font-medium rounded-md border border-transparent py-1.5 pl-3 pr-8 cursor-pointer focus:ring-2 focus:ring-indigo-600 transition-colors appearance-none ${getStatusColor(item.status)} ${updatingId === item.id ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-300'}`}
                    style={{ backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")', backgroundPosition: 'right 0.25rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.2em 1.2em' }}
                  >
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </td>
                <td className="py-5 px-6 whitespace-nowrap text-sm text-gray-500 text-right">
                  {new Date(item.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
