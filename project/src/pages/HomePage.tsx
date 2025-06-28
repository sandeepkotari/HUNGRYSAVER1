import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Users, BookOpen, Shield, Home, Zap, Building } from 'lucide-react';

const HomePage: React.FC = () => {
  const [visibleCards, setVisibleCards] = useState<number[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cardIndex = parseInt(entry.target.getAttribute('data-card') || '0');
            setVisibleCards(prev => [...new Set([...prev, cardIndex])]);
          }
        });
      },
      { threshold: 0.3 }
    );

    const cards = document.querySelectorAll('[data-card]');
    cards.forEach(card => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  const initiatives = [
    {
      icon: Heart,
      title: "🍛 Annamitra Seva",
      description: "Connecting surplus food with hungry families. Every meal counts in our mission to eliminate hunger and food waste.",
      image: "https://images.pexels.com/photos/6646917/pexels-photo-6646917.jpeg"
    },
    {
      icon: BookOpen,
      title: "📚 Vidya Jyothi",
      description: "Illuminating young minds through education support. Providing books, fees, and resources to deserving students.",
      image: "https://images.pexels.com/photos/8535230/pexels-photo-8535230.jpeg"
    },
    {
      icon: Shield,
      title: "🛡️ Suraksha Setu",
      description: "Building bridges of safety for vulnerable communities. Emergency support when it matters most.",
      image: "https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg"
    },
    {
      icon: Home,
      title: "🏠 PunarAsha",
      description: "Restoring hope through rehabilitation. Supporting families in rebuilding their lives with dignity.",
      image: "https://images.pexels.com/photos/5029857/pexels-photo-5029857.jpeg"
    },
    {
      icon: Zap,
      title: "⚡ Raksha Jyothi",
      description: "Emergency response for humans and animals. Rapid assistance during critical situations.",
      image: "https://images.pexels.com/photos/6646919/pexels-photo-6646919.jpeg"
    },
    {
      icon: Building,
      title: "🏛️ Jyothi Nilayam",
      description: "Creating sanctuaries of hope. Supporting shelters for both humans and animals in need.",
      image: "https://images.pexels.com/photos/5029851/pexels-photo-5029851.jpeg"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            poster="https://images.pexels.com/photos/6646917/pexels-photo-6646917.jpeg"
          >
            <source src="https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c0fd273d2c6d9a064f3ae35579b2bbdf&profile_id=139&oauth2_token_id=57447761" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/60" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Connecting Surplus Resources with{' '}
            <span className="text-green-400">Those in Need</span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-300 mb-8 leading-relaxed">
            Every login feeds hope. Every action creates impact. Join our mission to build a compassionate community across Andhra Pradesh.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Join Our Mission
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Our <span className="text-green-400">Initiatives</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Six powerful initiatives working together to create lasting change in communities across Andhra Pradesh. 
              Each initiative addresses specific needs while building a network of hope and support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {initiatives.map((initiative, index) => {
              const Icon = initiative.icon;
              return (
                <div
                  key={index}
                  data-card={index}
                  className={`bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 ${
                    visibleCards.includes(index) 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={initiative.image}
                      alt={initiative.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-4 left-4 bg-green-500 p-3 rounded-full shadow-lg">
                      <Icon className="h-6 w-6 text-white" />
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
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Ready to Make a <span className="text-green-400">Difference?</span>
          </h2>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Whether you're a volunteer ready to serve, a donor wanting to give, or someone in need of support, 
            our platform connects you with the right resources in your city.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-gray-700 p-6 rounded-lg">
              <Users className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Volunteers</h3>
              <p className="text-gray-300">Join our network of dedicated volunteers making impact in their communities.</p>
            </div>
            <div className="bg-gray-700 p-6 rounded-lg">
              <Heart className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Donors</h3>
              <p className="text-gray-300">Support initiatives that matter and see your contributions create real change.</p>
            </div>
            <div className="bg-gray-700 p-6 rounded-lg">
              <Shield className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Community</h3>
              <p className="text-gray-300">Access support and resources when you need them most.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full font-semibold transition-colors inline-flex items-center justify-center"
            >
              Get Started Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/login"
              className="border-2 border-green-400 text-green-400 hover:bg-green-400 hover:text-gray-900 px-8 py-3 rounded-full font-semibold transition-colors"
            >
              Already a Member? Login
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-700 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="bg-green-500 p-2 rounded-lg">
                <Heart className="h-6 w-6 text-white" fill="currentColor" />
              </div>
              <span className="text-xl font-bold text-white">Hungry Saver</span>
            </div>
            <p className="text-gray-400">
              © 2025 Hungry Saver. Building bridges of hope across World.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;