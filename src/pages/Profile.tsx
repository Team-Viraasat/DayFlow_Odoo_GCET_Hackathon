import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import { User, Edit2, X, Upload } from 'lucide-react';

export default function Profile() {
  const { currentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: '',
    address: '',
    department: currentUser?.department || '',
    employeeId: currentUser?.employeeId || '',
    role: currentUser?.role || '',
    profilePhoto: '',
  });

  useEffect(() => {
    // Load profile data from localStorage
    const profileData = localStorage.getItem(`profile_${currentUser?.id}`);
    if (profileData) {
      const parsed = JSON.parse(profileData);
      setFormData(prev => ({ ...prev, ...parsed }));
    }
  }, [currentUser]);

  const handleSave = () => {
    localStorage.setItem(`profile_${currentUser?.id}`, JSON.stringify(formData));
    setIsEditing(false);
  };

  const handleCancel = () => {
    const profileData = localStorage.getItem(`profile_${currentUser?.id}`);
    if (profileData) {
      setFormData(JSON.parse(profileData));
    }
    setIsEditing(false);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profilePhoto: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const isAdmin = currentUser?.role === 'admin';

  return (
    <Layout>
      <div className="max-w-3xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-gray-900 mb-1">Profile</h1>
            <p className="text-sm text-gray-500">Manage your personal information</p>
          </div>

          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#714B67] text-white text-sm rounded hover:bg-[#5f3f58] transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-sm text-gray-700 rounded hover:bg-gray-50 transition-colors"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-[#714B67] text-white text-sm rounded hover:bg-[#5f3f58] transition-colors"
              >
                Save
              </button>
            </div>
          )}
        </div>

        {/* Profile Photo */}
        <div className="bg-white border border-gray-200 rounded p-6 mb-4">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Profile Photo</h3>
          <div className="flex items-center gap-4">
            {formData.profilePhoto ? (
              <img
                src={formData.profilePhoto}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center">
                <User className="w-10 h-10 text-purple-600" />
              </div>
            )}
            {isEditing && (
              <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 cursor-pointer transition-colors">
                <Upload className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-700">Upload Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-white border border-gray-200 rounded p-6 mb-4">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Personal Information</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <label className="text-sm text-gray-600">Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="col-span-2 px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#714B67] focus:border-[#714B67]"
                />
              ) : (
                <div className="col-span-2 text-sm text-gray-900">{formData.name}</div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <label className="text-sm text-gray-600">Email</label>
              <div className="col-span-2 text-sm text-gray-500">{formData.email}</div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <label className="text-sm text-gray-600">Phone</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="col-span-2 px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#714B67] focus:border-[#714B67]"
                />
              ) : (
                <div className="col-span-2 text-sm text-gray-900">{formData.phone || 'Not provided'}</div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <label className="text-sm text-gray-600">Address</label>
              {isEditing ? (
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows={2}
                  className="col-span-2 px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#714B67] focus:border-[#714B67] resize-none"
                />
              ) : (
                <div className="col-span-2 text-sm text-gray-900">{formData.address || 'Not provided'}</div>
              )}
            </div>
          </div>
        </div>

        {/* Job Information */}
        <div className="bg-white border border-gray-200 rounded p-6">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Job Information</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <label className="text-sm text-gray-600">Employee ID</label>
              <div className="col-span-2 text-sm text-gray-500">{formData.employeeId}</div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <label className="text-sm text-gray-600">Department</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.department || currentUser.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#714B67] focus:border-transparent"
                />
              ) : (
                <div className="col-span-2 text-sm text-gray-500">{formData.department}</div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <label className="text-sm text-gray-600">Role</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.role || currentUser.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#714B67] focus:border-transparent"
                />
              ) : (
                <div className="col-span-2 text-sm text-gray-500">
                  {formData.role === 'admin' ? 'HR / Admin' : 'Employee'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}