import React, { useState, useEffect } from 'react';
import apiService from '../services/api';
import { useNotification } from '../contexts/NotificationContext';

const Stylist = () => {
  const [selectedOccasion, setSelectedOccasion] = useState('casual');
  const [isGenerating, setIsGenerating] = useState(false);
  const [preferences, setPreferences] = useState({
    style: 'modern',
    colors: ['blue', 'white', 'black'],
    budget: 'medium'
  });
  const [outfitSuggestions, setOutfitSuggestions] = useState([]);
  const { showSuccess, showError, showInfo } = useNotification();

  const occasions = [
    { id: 'casual', name: 'Casual', icon: '👕', description: 'Everyday comfort' },
    { id: 'work', name: 'Work', icon: '👔', description: 'Professional attire' },
    { id: 'party', name: 'Party', icon: '🎉', description: 'Night out' },
    { id: 'formal', name: 'Formal', icon: '🤵', description: 'Special events' },
    { id: 'sport', name: 'Sport', icon: '👟', description: 'Active wear' },
    { id: 'date', name: 'Date', icon: '💕', description: 'Romantic outings' }
  ];

  // Default fallback data
  const defaultOutfitSuggestions = [
    {
      id: 1,
      occasion: 'casual',
      title: 'Relaxed Weekend',
      items: [
        { name: 'White T-shirt', image: 'https://via.placeholder.com/150x180/ffffff/000000?text=White+Tee' },
        { name: 'Blue Jeans', image: 'https://via.placeholder.com/150x180/2563eb/ffffff?text=Blue+Jeans' },
        { name: 'White Sneakers', image: 'https://via.placeholder.com/150x180/f3f4f6/1f2937?text=Sneakers' }
      ],
      confidence: 95,
      weather_suitable: true,
      style_match: 'Perfect match for your modern style'
    },
    {
      id: 2,
      occasion: 'work',
      title: 'Professional Power',
      items: [
        { name: 'Navy Blazer', image: 'https://via.placeholder.com/150x180/1e40af/ffffff?text=Navy+Blazer' },
        { name: 'White Shirt', image: 'https://via.placeholder.com/150x180/ffffff/000000?text=White+Shirt' },
        { name: 'Black Trousers', image: 'https://via.placeholder.com/150x180/000000/ffffff?text=Black+Pants' },
        { name: 'Black Heels', image: 'https://via.placeholder.com/150x180/000000/ffffff?text=Heels' }
      ],
      confidence: 88,
      weather_suitable: true,
      style_match: 'Great for important meetings'
    },
    {
      id: 3,
      occasion: 'party',
      title: 'Night Out Glamour',
      items: [
        { name: 'Red Dress', image: 'https://via.placeholder.com/150x180/dc2626/ffffff?text=Red+Dress' },
        { name: 'Black Heels', image: 'https://via.placeholder.com/150x180/000000/ffffff?text=Heels' },
        { name: 'Gold Accessories', image: 'https://via.placeholder.com/150x180/f59e0b/000000?text=Gold+Bag' }
      ],
      confidence: 92,
      weather_suitable: false,
      style_match: 'Turn heads at any party!'
    }
  ];

  const generateOutfit = async () => {
    setIsGenerating(true);
    try {
      showInfo('Generating personalized outfit recommendations...');
      const recommendations = await apiService.generateOutfitRecommendations({
        occasion: selectedOccasion,
        ...preferences
      });
      setOutfitSuggestions(recommendations);
      showSuccess(`Generated ${recommendations.length} new outfit suggestions!`);
    } catch (error) {
      console.error('Error generating outfits:', error);
      showError('Unable to generate new outfits. Please try again.');
      // Fallback to default suggestions
      setOutfitSuggestions(defaultOutfitSuggestions.filter(outfit => outfit.occasion === selectedOccasion));
    } finally {
      setIsGenerating(false);
    }
  };

  const saveOutfitToFavorites = async (outfitId) => {
    try {
      await apiService.createOutfit({ id: outfitId, favorite: true });
      showSuccess('Outfit saved to favorites!');
    } catch (error) {
      console.error('Error saving outfit:', error);
      showError('Failed to save outfit. Please try again.');
    }
  };

  // Load preferences on mount
  useEffect(() => {
    loadPreferences();
    loadDefaultSuggestions();
  }, []);

  const loadPreferences = async () => {
    try {
      const userPreferences = await apiService.getStylePreferences();
      setPreferences(userPreferences);
    } catch (error) {
      console.error('Error loading preferences:', error);
      // Use default preferences
    }
  };

  const loadDefaultSuggestions = () => {
    // Load initial suggestions based on selected occasion
    const filtered = defaultOutfitSuggestions.filter(outfit => outfit.occasion === selectedOccasion);
    setOutfitSuggestions(filtered);
  };

  // Update suggestions when occasion changes
  useEffect(() => {
    const filtered = (outfitSuggestions.length > 0 ? outfitSuggestions : defaultOutfitSuggestions)
      .filter(outfit => outfit.occasion === selectedOccasion);
    setOutfitSuggestions(filtered);
  }, [selectedOccasion]);

  const styleTypes = [
    { id: 'modern', name: 'Modern', icon: '🏢' },
    { id: 'bohemian', name: 'Bohemian', icon: '🌸' },
    { id: 'classic', name: 'Classic', icon: '👑' },
    { id: 'edgy', name: 'Edgy', icon: '🖤' },
    { id: 'romantic', name: 'Romantic', icon: '💖' }
  ];

  // Use the state-managed outfit suggestions (already filtered)
  const filteredOutfits = outfitSuggestions;

  return (
    <div className="min-h-[calc(100vh-4rem-200px)] bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 py-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-purple-400 to-pink-600 rounded-full opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg mb-2">AI Stylist 🤖</h1>
          <p className="text-gray-200 text-lg">Get personalized outfit recommendations powered by AI</p>
        </div>

        {/* Occasion Selection */}
        <div className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">What's the occasion?</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {occasions.map((occasion) => (
              <button
                key={occasion.id}
                onClick={() => setSelectedOccasion(occasion.id)}
                className={`p-4 rounded-lg border-2 transition-all duration-300 text-center ${
                  selectedOccasion === occasion.id
                    ? 'border-purple-400 bg-gradient-to-br from-purple-500/20 to-pink-500/20 text-white shadow-lg'
                    : 'border-white/30 hover:border-white/50 text-gray-200 hover:bg-white/10 hover:scale-105'
                }`}
              >
                <div className="text-3xl mb-2">{occasion.icon}</div>
                <div className="font-medium text-sm">{occasion.name}</div>
                <div className="text-xs opacity-75 mt-1">{occasion.description}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Style Preferences */}
          <div className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Style Preferences</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Style Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {styleTypes.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setPreferences({...preferences, style: style.id})}
                      className={`p-3 rounded-lg border text-center transition-all duration-300 ${
                        preferences.style === style.id
                          ? 'border-purple-400 bg-gradient-to-br from-purple-500/20 to-pink-500/20 text-white shadow-lg'
                          : 'border-white/30 hover:border-white/50 text-gray-200 hover:bg-white/10'
                      }`}
                    >
                      <div>{style.icon}</div>
                      <div className="text-xs">{style.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Favorite Colors</label>
                <div className="flex flex-wrap gap-2">
                  {['blue', 'red', 'green', 'purple', 'pink', 'yellow', 'black', 'white'].map((color) => (
                    <button
                      key={color}
                      onClick={() => {
                        const newColors = preferences.colors.includes(color)
                          ? preferences.colors.filter(c => c !== color)
                          : [...preferences.colors, color];
                        setPreferences({...preferences, colors: newColors});
                      }}
                      className={`w-8 h-8 rounded-full border-2 ${
                        preferences.colors.includes(color) ? 'border-gray-800 ring-2 ring-purple-500' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color === 'white' ? '#f9fafb' : color }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Budget Range</label>
                <select 
                  value={preferences.budget}
                  onChange={(e) => setPreferences({...preferences, budget: e.target.value})}
                  className="w-full px-3 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 text-white"
                >
                  <option value="low">Budget Friendly ($0-$100)</option>
                  <option value="medium">Mid Range ($100-$300)</option>
                  <option value="high">Premium ($300+)</option>
                </select>
              </div>

              <button 
                onClick={generateOutfit}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 shadow-lg hover:shadow-xl hover:scale-105"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <span>✨</span>
                    <span>Generate New Outfit</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Outfit Recommendations */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl p-6">
              <h2 className="text-xl font-semibold text-white mb-6">
                Recommendations for {occasions.find(o => o.id === selectedOccasion)?.name}
              </h2>

              <div className="space-y-6">
                {filteredOutfits.map((outfit) => (
                  <div key={outfit.id} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 hover:bg-white/20 transition-all duration-300">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{outfit.title}</h3>
                        <p className="text-gray-200 text-sm">{outfit.style_match}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-green-400">
                          {outfit.confidence}% match
                        </div>
                        <div className={`text-xs ${outfit.weather_suitable ? 'text-green-400' : 'text-orange-400'}`}>
                          {outfit.weather_suitable ? '✓ Weather suitable' : '⚠ Check weather'}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      {outfit.items.map((item, index) => (
                        <div key={index} className="text-center">
                          <div className="bg-white/20 backdrop-blur-sm border border-white/20 rounded-lg overflow-hidden mb-2 aspect-square">
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <p className="text-xs text-gray-200">{item.name}</p>
                        </div>
                      ))}
                    </div>

                    <div className="flex space-x-3">
                      <button 
                        onClick={() => showInfo('Virtual try-on feature coming soon!')}
                        className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 shadow-lg"
                      >
                        Try This Outfit
                      </button>
                      <button 
                        onClick={() => saveOutfitToFavorites(outfit.id)}
                        className="flex-1 bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 text-gray-200 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300"
                      >
                        Save to Favorites
                      </button>
                      <button 
                        onClick={() => showInfo('Outfit modification feature coming soon!')}
                        className="flex-1 bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 text-gray-200 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300"
                      >
                        Modify
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {filteredOutfits.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">🎨</div>
                  <h3 className="text-lg font-medium text-white mb-2">No outfits yet</h3>
                  <p className="text-gray-200 mb-4">Generate some outfit ideas for this occasion</p>
                  <button 
                    onClick={generateOutfit}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 shadow-lg"
                  >
                    Create Outfits
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* AI Tips */}
        <div className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl p-6 mt-8">
          <div className="flex items-start space-x-4">
            <div className="text-2xl">💡</div>
            <div>
              <h3 className="font-semibold text-white mb-2">Style Tip of the Day</h3>
              <p className="text-gray-200">
                Mix textures to add visual interest to your outfit. Try pairing smooth silk with rough denim, 
                or soft knits with structured blazers for a balanced, sophisticated look.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stylist;