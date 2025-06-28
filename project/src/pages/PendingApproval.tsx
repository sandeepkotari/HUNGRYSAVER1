import React from 'react';
import { Clock, CheckCircle, Users, Heart, BookOpen, Shield, Home, Zap, Building } from 'lucide-react';

const PendingApproval: React.FC = () => {
  const initiatives = [
    {
      icon: Heart,
      title: "🍛 Annamitra Seva",
      description: "You'll help distribute surplus food to hungry families, ensuring no meal goes to waste while fighting hunger in your community.",
      impact: "Feed 50+ families daily",
      image: "https://images.pexels.com/photos/6646917/pexels-photo-6646917.jpeg"
    },
    {
      icon: BookOpen,
      title: "📚 Vidya Jyothi",
      description: "Support students by delivering educational materials, books, and helping with school fee payments for deserving children.",
      impact: "Educate 100+ children monthly",
      image: "https://images.pexels.com/photos/8535230/pexels-photo-8535230.jpeg"
    },
    {
      icon: Shield,
      title: "🛡️ Suraksha Setu",
      description: "Provide emergency support to vulnerable communities during crisis situations, being their safety net when needed most.",
      impact: "Support 200+ families in emergencies",
      image: "https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg"
    },
    {
      icon: Home,
      title: "🏠 PunarAsha",
      description: "Help families rebuild their lives through rehabilitation programs, providing dignity and hope for a better future.",
      impact: "Rebuild 30+ lives annually",
      image: "https://images.pexels.com/photos/5029857/pexels-photo-5029857.jpeg"
    },
    {
      icon: Zap,
      title: "⚡ Raksha Jyothi",
      description: "Respond to emergency situations for both humans and animals, providing rapid assistance during critical moments.",
      impact: "Emergency response 24/7",
      image: "https://images.pexels.com/photos/6646919/pexels-photo-6646919.jpeg"
    },
    {
      icon: Building,
      title: "🏛️ Jyothi Nilayam",
      description: "Support shelters for humans and animals in need, creating safe sanctuaries of hope and care.",
      impact: "Support 10+ shelters",
      image: "https://images.pexels.com/photos/5029851/pexels-photo-5029851.jpeg"
    }
  ];

  const motivationalQuotes = [
    "Every small act of kindness creates ripples of change in our community.",
    "Your compassion today will be someone's hope tomorrow.",
    "Together, we're not just changing lives—we're building a better future.",
    "In helping others, we discover the best version of ourselves."
  ];

  const [currentQuote, setCurrentQuote] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % motivationalQuotes.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-yellow-500 p-4 rounded-full animate-pulse">
              <Clock className="h-8 w-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Your Application is <span className="text-yellow-400">Under Review</span>
          </h1>
          
          <div className="bg-yellow-500/20 border border-yellow-500 rounded-lg px-6 py-4 inline-block mb-6">
            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-yellow-400" />
              <span className="text-yellow-200 font-medium">Status: Pending Approval</span>
            </div>
          </div>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Thank you for your interest in volunteering! Our admin team is reviewing your application. 
            In the meantime, learn about the amazing initiatives you'll be part of once approved.
          </p>
        </div>

        {/* Motivational Quote Carousel */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-8 mb-12 text-center">
          <div className="h-16 flex items-center justify-center">
            <p className="text-xl text-white italic font-medium transition-all duration-500">
              "{motivationalQuotes[currentQuote]}"
            </p>
          </div>
          <div className="flex justify-center space-x-2 mt-4">
            {motivationalQuotes.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentQuote ? 'bg-white' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Initiatives Grid */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Initiatives You'll Impact
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {initiatives.map((initiative, index) => {
              const Icon = initiative.icon;
              return (
                <div
                  key={index}
                  className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={initiative.image}
                      alt={initiative.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute top-4 left-4 bg-green-500 p-3 rounded-full shadow-lg">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium inline-block">
                        {initiative.impact}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-3">
                      {initiative.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {initiative.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* What Happens Next */}
        <div className="bg-gray-800 rounded-xl p-8">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">
            What Happens Next?
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-yellow-500 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Review Process</h4>
              <p className="text-gray-300">Our admin team reviews your application and verifies your information.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-500 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Approval Notification</h4>
              <p className="text-gray-300">You'll receive an email confirmation once your application is approved.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-500 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Start Volunteering</h4>
              <p className="text-gray-300">Access your location-specific dashboard and start making an impact!</p>
            </div>
          </div>
        </div>

        {/* Expected Timeline */}
        <div className="mt-8 text-center">
          <div className="bg-gray-700 rounded-lg p-6 inline-block">
            <p className="text-gray-300">
              <span className="text-white font-semibold">Expected Review Time:</span> 24-48 hours
            </p>
            <p className="text-gray-400 text-sm mt-2">
              You'll be redirected automatically once approved
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingApproval;