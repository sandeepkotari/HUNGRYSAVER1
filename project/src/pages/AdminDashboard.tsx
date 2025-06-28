import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, updateDoc, orderBy } from 'firebase/firestore';
import { Check, X, Clock, MapPin, GraduationCap, Mail, User, Crown, Heart, Users, Package, TrendingUp } from 'lucide-react';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';

interface PendingVolunteer {
  uid: string;
  firstName: string;
  email: string;
  location: string;
  education: string;
  createdAt: any;
}

interface DashboardStats {
  pendingVolunteers: number;
  totalDonations: number;
  totalRequests: number;
  approvedVolunteers: number;
}

const AdminDashboard: React.FC = () => {
  const [pendingVolunteers, setPendingVolunteers] = useState<PendingVolunteer[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    pendingVolunteers: 0,
    totalDonations: 0,
    totalRequests: 0,
    approvedVolunteers: 0
  });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState<string | null>(null);
  const { isAdmin } = useAuth();

  useEffect(() => {
    if (isAdmin) {
      fetchDashboardData();
    }
  }, [isAdmin]);

  const fetchDashboardData = async () => {
    try {
      // Fetch pending volunteers
      const pendingQuery = query(
        collection(db, 'users'),
        where('userType', '==', 'volunteer'),
        where('status', '==', 'pending'),
        orderBy('createdAt', 'desc')
      );
      const pendingSnapshot = await getDocs(pendingQuery);
      const volunteers = pendingSnapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data()
      })) as PendingVolunteer[];
      
      setPendingVolunteers(volunteers);

      // Fetch approved volunteers count
      const approvedQuery = query(
        collection(db, 'users'),
        where('userType', '==', 'volunteer'),
        where('status', '==', 'approved')
      );
      const approvedSnapshot = await getDocs(approvedQuery);

      // Fetch donations count
      const donationsSnapshot = await getDocs(collection(db, 'donations'));
      
      // Fetch requests count
      const requestsSnapshot = await getDocs(collection(db, 'community_requests'));

      setStats({
        pendingVolunteers: volunteers.length,
        totalDonations: donationsSnapshot.size,
        totalRequests: requestsSnapshot.size,
        approvedVolunteers: approvedSnapshot.size
      });
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (uid: string, approved: boolean, volunteerName: string) => {
    setActionLoading(uid);
    try {
      await updateDoc(doc(db, 'users', uid), {
        status: approved ? 'approved' : 'rejected',
        approvedAt: new Date()
      });
      
      // Remove from pending list
      setPendingVolunteers(prev => prev.filter(vol => vol.uid !== uid));
      
      // Update stats
      setStats(prev => ({
        ...prev,
        pendingVolunteers: prev.pendingVolunteers - 1,
        approvedVolunteers: approved ? prev.approvedVolunteers + 1 : prev.approvedVolunteers
      }));

      // Show success modal for approvals
      if (approved) {
        setShowSuccessModal(volunteerName);
        setTimeout(() => setShowSuccessModal(null), 4000);
      }
      
    } catch (error) {
      console.error('Error updating volunteer status:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleBulkApproval = async () => {
    if (pendingVolunteers.length === 0) return;
    
    setActionLoading('bulk');
    try {
      const promises = pendingVolunteers.map(volunteer =>
        updateDoc(doc(db, 'users', volunteer.uid), {
          status: 'approved',
          approvedAt: new Date()
        })
      );
      
      await Promise.all(promises);
      
      // Update stats
      setStats(prev => ({
        ...prev,
        pendingVolunteers: 0,
        approvedVolunteers: prev.approvedVolunteers + pendingVolunteers.length
      }));
      
      setPendingVolunteers([]);
      setShowSuccessModal(`${pendingVolunteers.length} volunteers`);
      setTimeout(() => setShowSuccessModal(null), 4000);
      
    } catch (error) {
      console.error('Error bulk approving volunteers:', error);
    } finally {
      setActionLoading(null);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-900 pt-20 flex items-center justify-center">
        <div className="text-center">
          <X className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-gray-400">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 rounded-xl p-6 mb-8 border border-yellow-500">
          <div className="flex items-center space-x-3">
            <Crown className="h-8 w-8 text-yellow-200" />
            <div>
              <h1 className="text-2xl font-bold text-white">👑 Welcome Admin</h1>
              <p className="text-yellow-200">You're managing Hungry Saver operations across all cities</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 border border-yellow-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-yellow-400">{stats.pendingVolunteers}</p>
                <p className="text-gray-400">Pending Volunteers</p>
              </div>
              <Clock className="h-10 w-10 text-yellow-400" />
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6 border border-green-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-green-400">{stats.approvedVolunteers}</p>
                <p className="text-gray-400">Active Volunteers</p>
              </div>
              <Users className="h-10 w-10 text-green-400" />
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6 border border-blue-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-blue-400">{stats.totalDonations}</p>
                <p className="text-gray-400">Total Donations</p>
              </div>
              <Heart className="h-10 w-10 text-blue-400" />
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6 border border-purple-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-purple-400">{stats.totalRequests}</p>
                <p className="text-gray-400">Community Requests</p>
              </div>
              <Package className="h-10 w-10 text-purple-400" />
            </div>
          </div>
        </div>

        {/* Pending Volunteers Section */}
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">Pending Volunteer Applications</h2>
              <p className="text-gray-400 text-sm">Review and approve new volunteers</p>
            </div>
            
            {pendingVolunteers.length > 0 && (
              <button
                onClick={handleBulkApproval}
                disabled={actionLoading === 'bulk'}
                className="bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                {actionLoading === 'bulk' ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
                <span>Approve All ({pendingVolunteers.length})</span>
              </button>
            )}
          </div>
          
          {pendingVolunteers.length === 0 ? (
            <div className="p-8 text-center">
              <TrendingUp className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <p className="text-green-400 text-lg font-medium">All caught up!</p>
              <p className="text-gray-400">No pending volunteer applications to review</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Volunteer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Education
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Applied
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {pendingVolunteers.map((volunteer) => (
                    <tr key={volunteer.uid} className="hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center">
                            <span className="text-white font-medium">
                              {volunteer.firstName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-white">{volunteer.firstName}</div>
                            <div className="text-sm text-gray-400">New Volunteer</div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-300">
                          <Mail className="h-4 w-4 mr-2 text-gray-400" />
                          {volunteer.email}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                          <span className="text-sm text-gray-300 capitalize">
                            {volunteer.location}
                          </span>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <GraduationCap className="h-4 w-4 mr-2 text-gray-400" />
                          <span className="text-sm text-gray-300">{volunteer.education}</span>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {volunteer.createdAt?.toDate?.()?.toLocaleDateString() || 'Recently'}
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleApproval(volunteer.uid, true, volunteer.firstName)}
                            disabled={actionLoading === volunteer.uid}
                            className="bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white px-3 py-1 rounded-md transition-colors flex items-center space-x-1"
                          >
                            {actionLoading === volunteer.uid ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                            ) : (
                              <Check className="h-4 w-4" />
                            )}
                            <span>Approve</span>
                          </button>
                          
                          <button
                            onClick={() => handleApproval(volunteer.uid, false, volunteer.firstName)}
                            disabled={actionLoading === volunteer.uid}
                            className="bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white px-3 py-1 rounded-md transition-colors flex items-center space-x-1"
                          >
                            <X className="h-4 w-4" />
                            <span>Reject</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Success Modal */}
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-xl p-8 max-w-md mx-4 text-center border border-green-500">
              <div className="bg-green-500 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Check className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">🎉 Congratulations!</h3>
              <p className="text-gray-300 mb-4">
                <span className="text-green-400 font-medium">{showSuccessModal}</span> {showSuccessModal.includes('volunteers') ? 'are' : 'is'} now part of the Hungry Saver Volunteer Team.
              </p>
              <div className="bg-green-500/20 border border-green-500 rounded-lg p-3">
                <p className="text-green-400 text-sm">
                  {showSuccessModal.includes('volunteers') ? 'They' : 'They'} can now access their location dashboard and start helping the community!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;