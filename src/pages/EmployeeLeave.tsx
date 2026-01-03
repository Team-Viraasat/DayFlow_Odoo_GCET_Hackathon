import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import { Plus, X } from 'lucide-react';

interface LeaveRequest {
  id: string;
  employeeId: string;
  type: string;
  startDate: string;
  endDate: string;
  dateRange: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  submittedDate: string;
  reviewedBy?: string;
  reviewComment?: string;
}

export default function EmployeeLeave() {
  const { currentUser } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [formData, setFormData] = useState({
    type: 'Paid Leave',
    startDate: '',
    endDate: '',
    reason: '',
  });

  useEffect(() => {
    loadLeaveRequests();
  }, [currentUser]);

  const loadLeaveRequests = () => {
    const stored = localStorage.getItem('leaveRequests');
    if (stored) {
      const allRequests = JSON.parse(stored);
      const userRequests = allRequests.filter(
        (r: LeaveRequest) => r.employeeId === currentUser?.employeeId
      );
      setRequests(userRequests.sort((a: LeaveRequest, b: LeaveRequest) => 
        new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime()
      ));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newRequest: LeaveRequest = {
      id: Date.now().toString(),
      employeeId: currentUser?.employeeId || '',
      type: formData.type,
      startDate: formData.startDate,
      endDate: formData.endDate,
      dateRange: `${new Date(formData.startDate).toLocaleDateString()} - ${new Date(formData.endDate).toLocaleDateString()}`,
      reason: formData.reason,
      status: 'Pending',
      submittedDate: new Date().toISOString(),
    };

    const allRequests = JSON.parse(localStorage.getItem('leaveRequests') || '[]');
    allRequests.push(newRequest);
    localStorage.setItem('leaveRequests', JSON.stringify(allRequests));

    setRequests([newRequest, ...requests]);
    setFormData({ type: 'Paid Leave', startDate: '', endDate: '', reason: '' });
    setShowForm(false);
  };

  return (
    <Layout>
      <div className="max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-gray-900 mb-1">Leave Management</h1>
            <p className="text-sm text-gray-500">Apply and track your leave requests</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-[#714B67] text-white text-sm rounded hover:bg-[#5f3f58] transition-colors"
          >
            {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showForm ? 'Cancel' : 'Apply for Leave'}
          </button>
        </div>

        {/* Leave Application Form */}
        {showForm && (
          <div className="bg-white border border-gray-200 rounded p-6 mb-4">
            <h3 className="text-sm font-medium text-gray-900 mb-4">New Leave Request</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1.5">Leave Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#714B67] focus:border-[#714B67]"
                  required
                >
                  <option value="Paid Leave">Paid Leave</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Unpaid Leave">Unpaid Leave</option>
                  <option value="Casual Leave">Casual Leave</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#714B67] focus:border-[#714B67]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">End Date</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#714B67] focus:border-[#714B67]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1.5">Reason</label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#714B67] focus:border-[#714B67] resize-none"
                  placeholder="Enter reason for leave"
                />
              </div>

              <button
                type="submit"
                className="w-full px-4 py-2 bg-[#714B67] text-white text-sm rounded hover:bg-[#5f3f58] transition-colors"
              >
                Submit Request
              </button>
            </form>
          </div>
        )}

        {/* Leave Requests Table */}
        <div className="bg-white border border-gray-200 rounded overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-sm font-medium text-gray-900">Leave Requests</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Date Range</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Reason</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Submitted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {requests.length > 0 ? (
                  requests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{request.type}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{request.dateRange}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{request.reason}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${
                          request.status === 'Approved' ? 'bg-green-50 text-green-700' :
                          request.status === 'Rejected' ? 'bg-red-50 text-red-700' :
                          'bg-yellow-50 text-yellow-700'
                        }`}>
                          {request.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(request.submittedDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-500">
                      No leave requests found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}