import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { FileCheck, Check, X as XIcon, MessageSquare } from 'lucide-react';

interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  type: 'Paid Leave' | 'Sick Leave' | 'Unpaid Leave';
  startDate: string;
  endDate: string;
  remarks: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  submittedDate: string;
  adminComment?: string;
}

export default function AdminLeave() {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [adminComment, setAdminComment] = useState('');

  useEffect(() => {
    loadLeaveRequests();
  }, []);

  const loadLeaveRequests = () => {
    const stored = localStorage.getItem('leaveRequests');
    if (stored) {
      const requests = JSON.parse(stored);
      setLeaveRequests(requests);
    }
  };

  const updateRequestStatus = (id: string, status: 'Approved' | 'Rejected') => {
    const stored = localStorage.getItem('leaveRequests');
    if (stored) {
      const requests = JSON.parse(stored);
      const updated = requests.map((r: LeaveRequest) =>
        r.id === id ? { ...r, status, adminComment } : r
      );
      localStorage.setItem('leaveRequests', JSON.stringify(updated));
      setLeaveRequests(updated);
      setSelectedRequest(null);
      setAdminComment('');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'Rejected':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'Pending':
        return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const end = new Date(endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return `${start} - ${end}`;
  };

  const pendingRequests = leaveRequests.filter(r => r.status === 'Pending');
  const processedRequests = leaveRequests.filter(r => r.status !== 'Pending');

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">Leave Approvals</h1>
          <p className="text-sm text-gray-600">Review and manage employee leave requests</p>
        </div>

        {pendingRequests.length > 0 && (
          <div className="bg-white border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-yellow-600" />
                <h2 className="text-gray-900">Pending Requests ({pendingRequests.length})</h2>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Employee ID</th>
                    <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Leave Type</th>
                    <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Date Range</th>
                    <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Remarks</th>
                    <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {pendingRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{request.employeeId}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{request.employeeName}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{request.type}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {formatDateRange(request.startDate, request.endDate)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                        {request.remarks}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedRequest(request)}
                            className="px-3 py-1 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
                          >
                            Review
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="bg-white border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-blue-600" />
              <h2 className="text-gray-900">All Leave Requests</h2>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Employee ID</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Leave Type</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Date Range</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Submitted</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {leaveRequests.length > 0 ? (
                  leaveRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{request.employeeId}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{request.employeeName}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{request.type}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {formatDateRange(request.startDate, request.endDate)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(request.submittedDate).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs border rounded ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-500">
                      No leave requests yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-gray-900">Review Leave Request</h2>
              <button
                onClick={() => {
                  setSelectedRequest(null);
                  setAdminComment('');
                }}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-gray-600 mb-1">Employee ID</div>
                  <div className="text-gray-900">{selectedRequest.employeeId}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">Employee Name</div>
                  <div className="text-gray-900">{selectedRequest.employeeName}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">Leave Type</div>
                  <div className="text-gray-900">{selectedRequest.type}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">Date Range</div>
                  <div className="text-gray-900">
                    {formatDateRange(selectedRequest.startDate, selectedRequest.endDate)}
                  </div>
                </div>
              </div>

              <div>
                <div className="text-xs text-gray-600 mb-1">Employee Remarks</div>
                <div className="text-gray-900 bg-gray-50 p-3 rounded border border-gray-200">
                  {selectedRequest.remarks}
                </div>
              </div>

              <div>
                <label htmlFor="adminComment" className="block text-sm text-gray-700 mb-2">
                  <MessageSquare className="w-4 h-4 inline mr-1" />
                  Admin Comment (Optional)
                </label>
                <textarea
                  id="adminComment"
                  value={adminComment}
                  onChange={(e) => setAdminComment(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Add a comment..."
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => updateRequestStatus(selectedRequest.id, 'Rejected')}
                className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-700 rounded hover:bg-red-50 transition-colors"
              >
                <XIcon className="w-4 h-4" />
                Reject
              </button>
              <button
                onClick={() => updateRequestStatus(selectedRequest.id, 'Approved')}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                <Check className="w-4 h-4" />
                Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}