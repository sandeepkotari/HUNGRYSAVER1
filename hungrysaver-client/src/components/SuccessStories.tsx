import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

interface Story {
  id: number;
  image: string;
  quote: string;
  author: string;
  location: string;
  impact: string;
  beforeImage?: string;
  afterImage?: string;
}

const stories: Story[] = [
  {
    id: 1,
    image: "https://images.pexels.com/photos/8363026/pexels-photo-8363026.jpeg",
    quote: "Thanks to Hungry Saver, my children didn't go to bed hungry. Now they smile every day and focus on their studies.",
    author: "Priya Sharma",
    location: "Vijayawada",
    impact: "Fed family of 4 for a week",
    beforeImage: "https://images.pexels.com/photos/8363028/pexels-photo-8363028.jpeg",
    afterImage: "https://images.pexels.com/photos/8363026/pexels-photo-8363026.jpeg"
  },
  {
    id: 2,
    image: "https://images.pexels.com/photos/8535230/pexels-photo-8535230.jpeg",
    quote: "I can now focus on studies instead of worrying about school fees. My dreams are becoming reality!",
    author: "Ravi Kumar",
    location: "Guntur",
    impact: "Education support for 6 months"
  },
  {
    id: 3,
    image: "https://images.pexels.com/photos/6646917/pexels-photo-6646917.jpeg",
    quote: "The volunteers became like family to us. They didn't just bring food, they brought hope and dignity.",
    author: "Lakshmi Devi",
    location: "Visakhapatnam",
    impact: "Regular meal support for elderly couple"
  },
  {
    id: 4,
    image: "https://images.pexels.com/photos/5029857/pexels-photo-5029857.jpeg",
    quote: "After losing everything in floods, Hungry Saver helped us rebuild. Today, we have our own small business!",
    author: "Venkat Rao",
    location: "Kakinada",
    impact: "Complete rehabilitation support"
  }
];

const SuccessStories: React.FC = () => {
  const [currentStory, setCurrentStory] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentStory((prev) => (prev + 1) % stories.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextStory = () => {
    setCurrentStory((prev) => (prev + 1) % stories.length);
    setIsAutoPlaying(false);
  };

  const prevStory = () => {
    setCurrentStory((prev) => (prev - 1 + stories.length) % stories.length);
    setIsAutoPlaying(false);
  };

  const story = stories[currentStory];

  return (
    <div className="bg-gradient-to-r from-green-600 via-green-700 to-green-800 rounded-xl p-8 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold flex items-center">
            💝 Stories of Hope & Transformation
          </h3>
          <div className="flex space-x-2">
            <button
              onClick={prevStory}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={nextStory}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Story Content */}
          <div className="space-y-6">
            <div className="relative">
              <Quote className="h-8 w-8 text-green-200 mb-4" />
              <blockquote className="text-lg leading-relaxed italic">
                "{story.quote}"
              </blockquote>
            </div>

            <div className="border-l-4 border-green-300 pl-4">
              <p className="font-semibold text-green-100">{story.author}</p>
              <p className="text-green-200 text-sm">{story.location}</p>
              <p className="text-green-300 text-sm font-medium mt-1">
                Impact: {story.impact}
              </p>
            </div>

            {/* Progress Indicators */}
            <div className="flex space-x-2">
              {stories.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStory(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentStory ? 'w-8 bg-white' : 'w-2 bg-white/40'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Story Image */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-xl shadow-2xl">
              <img
                src={story.image}
                alt={`${story.author} - Success Story`}
                className="w-full h-64 object-cover transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3">
                  <p className="text-gray-800 font-semibold text-sm">
                    🌟 Life Changed Through Hungry Saver
                  </p>
                </div>
              </div>
            </div>

            {/* Before/After if available */}
            {story.beforeImage && story.afterImage && (
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="text-center">
                  <img
                    src={story.beforeImage}
                    alt="Before"
                    className="w-full h-20 object-cover rounded-lg opacity-70"
                  />
                  <p className="text-xs text-green-200 mt-1">Before</p>
                </div>
                <div className="text-center">
                  <img
                    src={story.afterImage}
                    alt="After"
                    className="w-full h-20 object-cover rounded-lg"
                  />
                  <p className="text-xs text-green-200 mt-1">After</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-8 text-center">
          <p className="text-green-100 mb-4">
            🧡 <strong>This is not just a donation — it's a lifeline.</strong>
          </p>
          <p className="text-green-200 text-sm">
            Your participation changes lives. Even ₹1 can bring hope, hunger relief, and dignity to someone in need.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuccessStories;