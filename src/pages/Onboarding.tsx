import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Upload } from 'lucide-react';

export default function Onboarding() {
  const { currentUser, updateProfile } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
    phone: '',
    address: '',
    profilePhoto: '',
  });
  
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    updateProfile({
      phone: formData.phone,
      address: formData.address,
      profilePhoto: formData.profilePhoto,
      needsOnboarding: false,
    });

    navigate('/dashboard');
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

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-[#714B67] rounded flex items-center justify-center mr-3">
              <span className="text-white font-semibold">DF</span>
            </div>
            <h1 className="text-2xl font-semibold text-gray-900">DayFlow</h1>
          </div>
          <p className="text-sm text-gray-600 text-center">Complete your profile setup</p>
        </div>

        <div className="bg-white border border-gray-200 shadow-sm p-8">
          <div className="mb-6">
            <div className="text-sm text-gray-600 mb-1">Step 1 of 1</div>
            <div className="text-gray-900">Profile Setup</div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Employee ID</label>
                <input
                  type="text"
                  value={currentUser?.employeeId || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 text-gray-600"
                  disabled
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={currentUser?.email || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 text-gray-600"
                  disabled
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="newPassword" className="block text-sm text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#714B67] focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#714B67] focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#714B67] focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm text-gray-700 mb-2">
                Address
              </label>
              <textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#714B67] focus:border-transparent resize-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Profile Photo (Optional)
              </label>
              <div className="flex items-center gap-4">
                {formData.profilePhoto && (
                  <img 
                    src={formData.profilePhoto} 
                    alt="Profile" 
                    className="w-16 h-16 rounded-full object-cover"
                  />
                )}
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
              </div>
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded border border-red-200">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#714B67] text-white py-2 rounded hover:bg-[#5f3f58] transition-colors"
            >
              Save & Continue
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}