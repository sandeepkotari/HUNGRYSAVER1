import React, { useState } from 'react';
import { Heart, BookOpen, Shield, Home, Zap, Building } from 'lucide-react';
import { useFormSubmission } from '../hooks/useFormSubmission';
import AnnamitraSevaForm from '../components/DonorForms/AnnamitraSevaForm';
import VidyaJyothiForm from '../components/DonorForms/VidyaJyothiForm';
import SurakshaSetuForm from '../components/DonorForms/SurakshaSetuForm';
import PunarAshaForm from '../components/DonorForms/PunarAshaForm';
import RakshaJyothiForm from '../components/DonorForms/RakshaJyothiForm';
import JyothiNilayamForm from '../components/DonorForms/JyothiNilayamForm';

const DonorDashboard: React.FC = () => {
  const [selectedInitiative, setSelectedInitiative] = useState('annamitra-seva');
  const { submitForm, loading, error, success, resetForm } = useFormSubmission('donor');

  const initiatives = [
    {
      id: 'annamitra-seva',
      icon: Heart,
      title: "🍛 Annamitra Seva",
      description: "Donate surplus food to feed hungry families in your community.",
      component: AnnamitraSevaForm,
      available: true
    },
    {
      id: 'vidya-jyothi',
      icon: BookOpen,
      title: "📚 Vidya Jyothi",
      description: "Support education through financial assistance for fees, books, and uniforms.",
      component: VidyaJyothiForm,
      available: true
    },
    {
      id: 'suraksha-setu',
      icon: Shield,
      title: "🤝 Suraksha Setu",
      description: "Donate items like clothing, books, and groceries for emergency support.",
      component: SurakshaSetuForm,
      available: true
    },
    {
      id: 'punarasha',
      icon: Home,
      title: "🔄 PunarAsha",
      description: "Donate electronics, furniture, and other items for rehabilitation support.",
      component: PunarAshaForm,
      available: true
    },
    {
      id: 'raksha-jyothi',
      icon: Zap,
      title: "🚨 Raksha Jyothi",
      description: "Provide emergency support for medical, accident, or animal emergencies.",
      component: RakshaJyothiForm,
      available: true
    },
    {
      id: 'jyothi-nilayam',
      icon: Building,
      title: "🏠 Jyothi Nilayam",
      description: "Support shelters for humans and animals with full or partial donations.",
      component: JyothiNilayamForm,
      available: true
    }
  ];

  const handleFormSubmit = async (formData: any): Promise<boolean> => {
    const submissionData = {
      ...formData,
      initiative: selectedInitiative
    };
    
    const result = await submitForm(submissionData);
    if (result) {
      // Reset form after successful submission
      setTimeout(() => {
        resetForm();
      }, 3000);
    }
    return result;
  };

  const selectedInitiativeData = initiatives.find(init => init.id === selectedInitiative);
  const FormComponent = selectedInitiativeData?.component;

  if (success) {
    return (
      <div className="min-h-screen bg-gray-900 pt-20 flex items-center justify-center">
        <div className="bg-gray-800 rounded-xl p-8 text-center max-w-md mx-4">
          <div className="bg-green-500 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Heart className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Donation Submitted!</h2>
          <p className="text-gray-300 mb-4">
            Thank you for your generous donation. Volunteers in your area will be notified and will contact you soon to arrange pickup/delivery.
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
            Make Another Donation
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
            Donor Dashboard
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Choose an initiative to make your donation. Your generosity helps build a stronger, more compassionate community.
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
                  <button
                    key={initiative.id}
                    onClick={() => setSelectedInitiative(initiative.id)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      selectedInitiative === initiative.id
                        ? 'border-green-500 bg-green-500/20'
                        : 'border-gray-600 bg-gray-800 hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <Icon className="h-6 w-6 mt-1 flex-shrink-0 text-green-400" />
                      <div>
                        <h3 className="font-medium text-lg text-white">
                          {initiative.title}
                        </h3>
                        <p className="text-sm mt-1 text-gray-300">
                          {initiative.description}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Donation Form */}
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

        {/* Impact Stats */}
        <div className="mt-16 bg-gray-800 rounded-xl p-8">
          <h3 className="text-2xl font-bold text-white text-center mb-8">Your Impact</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-green-500 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <p className="text-2xl font-bold text-white">25</p>
              <p className="text-gray-400">Families Fed</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-500 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <p className="text-2xl font-bold text-white">12</p>
              <p className="text-gray-400">Students Supported</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-500 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <p className="text-2xl font-bold text-white">8</p>
              <p className="text-gray-400">Emergency Responses</p>
            </div>
            
            <div className="text-center">
              <div className="bg-yellow-500 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Building className="h-8 w-8 text-white" />
              </div>
              <p className="text-2xl font-bold text-white">3</p>
              <p className="text-gray-400">Shelters Supported</p>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-green-400 font-medium text-lg">
              Thank you for making a difference in your community! 🙏
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorDashboard;