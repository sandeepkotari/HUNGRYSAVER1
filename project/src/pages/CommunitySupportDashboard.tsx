import React, { useState, useEffect } from 'react';
import { Heart, BookOpen, Shield, Home, Zap, Building, MapPin, User, Phone, Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useFormSubmission } from '../hooks/useFormSubmission';
import { getUserRequests } from '../services/firestoreService';
import { useAuth } from '../contexts/AuthContext';
import AnnamitraCommunityForm from '../components/CommunitySupportForms/AnnamitraCommunityForm';
import VidyaJyothiCommunityForm from '../components/CommunitySupportForms/VidyaJyothiCommunityForm';
import SurakshaSetuCommunityForm from '../components/CommunitySupportForms/SurakshaSetuCommunityForm';
import PunarAshaCommunityForm from '../components/CommunitySupportForms/PunarAshaCommunityForm';
import RakshaJyothiCommunityForm from '../components/CommunitySupportForms/RakshaJyothiCommunityForm';
import JyothiNilayamCommunityForm from '../components/CommunitySupportForms/JyothiNilayamCommunityForm';

interface CommunityRequest {
  id?: string;
  userId: string;
  initiative: string;
  location_lowercase: string;
  address: string;
  details: any;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: any;
}

const CommunitySupportDashboard: React.FC = () => {
  const [selectedInitiative, setSelectedInitiative] = useState('annamitra-seva');
  const { submitForm, loading, error, success, resetForm } = useFormSubmission('community');
  const [requestHistory, setRequestHistory] = useState<CommunityRequest[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const { userData } = useAuth();

  const initiatives = [
    {
      id: 'annamitra-seva',
      icon: Heart,
      title: "🍛 Annamitra Seva",
      description: "Request food assistance for families in need. We connect surplus food with hungry families in your community.",
      component: AnnamitraCommunityForm
    },
    {
      id: 'vidya-jyothi',
      icon: BookOpen,
      title: "📚 Vidya Jyothi",
      description: "Educational support for children including books, fees, uniforms, and school supplies.",
      component: VidyaJyothiCommunityForm
    },
    {
      id: 'suraksha-setu',
      icon: Shield,
      title: "🤝 Suraksha Setu",
      description: "Emergency support during crisis situations. Safety net for vulnerable community members.",
      component: SurakshaSetuCommunityForm
    },
    {
      id: 'punarasha',
      icon: Home,
      title: "🔄 PunarAsha",
      description: "Rehabilitation support to help families rebuild their lives with dignity and hope.",
      component: PunarAshaCommunityForm
    },
    {
      id: 'raksha-jyothi',
      icon: Zap,
      title: "🚨 Raksha Jyothi",
      description: "Emergency response for humans and animals during critical situations requiring immediate assistance.",
      component: RakshaJyothiCommunityForm
    },
    {
      id: 'jyothi-nilayam',
      icon: Building,
      title: "🏠 Jyothi Nilayam",
      description: "Support for shelters caring for humans and animals in need of safe sanctuary.",
      component: JyothiNilayamCommunityForm
    }
  ];

  useEffect(() => {
    fetchRequestHistory();
  }, [userData]);

  const fetchRequestHistory = async () => {
    if (!userData?.uid) return;
    
    try {
      const requests = await getUserRequests(userData.uid);
      setRequestHistory(requests as CommunityRequest[]);
    } catch (error) {
      console.error('Error fetching request history:', error);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleFormSubmit = async (formData: any): Promise<boolean> => {
    const submissionData = {
      ...formData,
      initiative: selectedInitiative
    };
    
    const result = await submitForm(submissionData);
    if (result) {
      // Refresh history and reset form after successful submission
      fetchRequestHistory();
      setTimeout(() => {
        resetForm();
      }, 3000);
    }
    return result;
  };

  const selectedInitiativeData = initiatives.find(init => init.id === selectedInitiative);
  const FormComponent = selectedInitiativeData?.component;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500';
      case 'approved': return 'bg-green-500/20 text-green-400 border-green-500';
      case 'rejected': return 'bg-red-500/20 text-red-400 border-red-500';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-900 pt-20 flex items-center justify-center">
        <div className="bg-gray-800 rounded-xl p-8 text-center max-w-md mx-4">
          <div className="bg-green-500 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Heart className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Request Submitted!</h2>
          <p className="text-gray-300 mb-4">
            Your request has been submitted successfully. Volunteers in your area will be notified and will reach out to you soon.
          </p>
          <div className="bg-green-500/20 border border-green-500 rounded-lg p-3">
            <p className="text-green-400 text-sm">
              Expected response time: 2-6 hours
            </p>
          </div>
          <button
            onClick={resetForm}
            className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Submit Another Request
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Community Support Dashboard
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Submit requests for support through our community initiatives. Select the initiative that best matches your needs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Initiative Selection */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold text-white mb-6">Select Initiative</h2>
            <div className="space-y-3">
              {initiatives.map((initiative) => {
                const Icon = initiative.icon;
                return (
                  <label
                    key={initiative.id}
                    className={`cursor-pointer block p-4 rounded-lg border-2 transition-all ${
                      selectedInitiative === initiative.id
                        ? 'border-green-500 bg-green-500/20'
                        : 'border-gray-600 bg-gray-800 hover:border-gray-500'
                    }`}
                  >
                    <input
                      type="radio"
                      name="initiative"
                      value={initiative.id}
                      checked={selectedInitiative === initiative.id}
                      onChange={() => setSelectedInitiative(initiative.id)}
                      className="sr-only"
                    />
                    <div className="flex items-start space-x-3">
                      <Icon className="h-6 w-6 text-green-400 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="text-white font-medium text-lg">{initiative.title}</h3>
                        <p className="text-gray-300 text-sm mt-1">{initiative.description}</p>
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Request Form */}
          <div className="lg:col-span-2">
            {FormComponent && (
              <FormComponent onSubmit={handleFormSubmit} loading={loading} />
            )}
            
            {error && (
              <div className="mt-4 bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg">
                <p className="text-sm">{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Request History */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-6">Request History</h2>
          
          {historyLoading ? (
            <div className="bg-gray-800 rounded-lg p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading request history...</p>
            </div>
          ) : requestHistory.length === 0 ? (
            <div className="bg-gray-800 rounded-lg p-8 text-center">
              <Calendar className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No requests yet</h3>
              <p className="text-gray-400">Your submitted requests will appear here</p>
            </div>
          ) : (
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Initiative
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {requestHistory.map((request) => (
                      <tr key={request.id} className="hover:bg-gray-700 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {request.createdAt?.toDate?.()?.toLocaleDateString() || 'Recently'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-white capitalize">
                              {request.initiative.replace('-', ' ')}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 capitalize">
                          {request.location_lowercase}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs border font-medium ${getStatusColor(request.status)}`}>
                            {getStatusIcon(request.status)}
                            <span className="ml-1 capitalize">{request.status}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-green-400 hover:text-green-300 transition-colors">
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunitySupportDashboard;