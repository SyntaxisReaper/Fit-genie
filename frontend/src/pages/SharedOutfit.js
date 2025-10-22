import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { socialSharingManager } from '../utils/socialSharing';

const SharedOutfit = () => {
  const { shareId } = useParams();
  const navigate = useNavigate();
  const [outfitData, setOutfitData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (shareId) {
      loadSharedOutfit(shareId);
    } else {
      setError('No share ID provided');
      setLoading(false);
    }
  }, [shareId]);

  const loadSharedOutfit = (id) => {
    try {
      const sharedData = socialSharingManager.getSharedOutfit(id);
      
      if (sharedData) {
        setOutfitData(sharedData);
        // Track view
        socialSharingManager.trackView(id);
      } else {
        setError('Shared outfit not found');
      }
    } catch (err) {
      console.error('Error loading shared outfit:', err);
      setError('Failed to load shared outfit');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = () => {
    if (outfitData) {
      // In a real app, this would update the backend
      const updatedData = { ...outfitData, likes: (outfitData.likes || 0) + 1 };
      setOutfitData(updatedData);
      
      // Update localStorage
      const sharedOutfits = JSON.parse(localStorage.getItem('sharedOutfits') || '{}');
      sharedOutfits[shareId] = updatedData;
      localStorage.setItem('sharedOutfits', JSON.stringify(sharedOutfits));
    }
  };

  const handleTryThisLook = () => {
    navigate('/mirror', { state: { selectedOutfit: outfitData.outfit } });
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem-200px)] bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading shared outfit...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-4rem-200px)] bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center py-20">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-4">😔</div>
          <h1 className="text-2xl font-bold text-white mb-2">Outfit Not Found</h1>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => navigate('/mirror')}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium"
          >
            Go to Smart Mirror
          </button>
        </div>
      </div>
    );
  }

  const { outfit, analysis, timestamp, likes, views } = outfitData;

  return (
    <div className="min-h-[calc(100vh-4rem-200px)] bg-gradient-to-br from-gray-900 via-purple-900 to-black py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center space-x-2">
            <span>👗</span>
            <span>Shared Outfit</span>
          </h1>
          <p className="text-gray-300">Discover and try this amazing look!</p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Outfit Preview */}
          <div className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl p-6">
            <div className="text-center mb-6">
              <img 
                src={outfit.thumbnail} 
                alt={outfit.name}
                className="w-48 h-60 object-cover rounded-lg mx-auto mb-4 border-2 border-white/20"
              />
              <h2 className="text-2xl font-bold text-white mb-2">{outfit.name}</h2>
              <p className="text-gray-300">{outfit.items?.join(' • ')}</p>
            </div>

            {/* Outfit Details */}
            <div className="space-y-3">
              <div className="flex justify-between items-center bg-white/10 rounded-lg p-3">
                <span className="text-gray-300">Confidence Match</span>
                <span className="text-white font-semibold">{outfit.confidence}%</span>
              </div>
              
              <div className="flex justify-between items-center bg-white/10 rounded-lg p-3">
                <span className="text-gray-300">Weather Suitable</span>
                <span className={`font-semibold ${outfit.weatherSuitable ? 'text-green-400' : 'text-orange-400'}`}>
                  {outfit.weatherSuitable ? '✅ Yes' : '⚠️ Check Weather'}
                </span>
              </div>

              {analysis && (
                <>
                  <div className="flex justify-between items-center bg-white/10 rounded-lg p-3">
                    <span className="text-gray-300">AI Analysis</span>
                    <span className="text-blue-400 font-semibold">{analysis.confidence}% accurate</span>
                  </div>
                  
                  {analysis.fitScore && (
                    <div className="flex justify-between items-center bg-white/10 rounded-lg p-3">
                      <span className="text-gray-300">Fit Score</span>
                      <span className="text-purple-400 font-semibold">{analysis.fitScore}%</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Actions & Stats */}
          <div className="space-y-6">
            {/* Stats */}
            <div className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                <span>📊</span>
                <span>Social Stats</span>
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">{views || 0}</div>
                  <div className="text-gray-300 text-sm">Views</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-pink-400">{likes || 0}</div>
                  <div className="text-gray-300 text-sm">Likes</div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-white/20 text-center">
                <p className="text-gray-300 text-sm">
                  Shared {new Date(timestamp).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                <span>🎯</span>
                <span>Try This Look</span>
              </h3>
              
              <div className="space-y-3">
                <button
                  onClick={handleTryThisLook}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <span>🪞</span>
                  <span>Try in Smart Mirror</span>
                </button>
                
                <button
                  onClick={handleLike}
                  className="w-full bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-lg font-medium transition-all flex items-center justify-center space-x-2"
                >
                  <span>❤️</span>
                  <span>Like This Look</span>
                </button>

                <button
                  onClick={() => {
                    const shareText = `Check out this ${outfit.name} outfit! Created with Stylin Smart Mirror 🪞`;
                    if (navigator.share) {
                      navigator.share({
                        title: `${outfit.name} Outfit`,
                        text: shareText,
                        url: window.location.href
                      });
                    } else {
                      navigator.clipboard.writeText(`${shareText}\n${window.location.href}`);
                      alert('Link copied to clipboard!');
                    }
                  }}
                  className="w-full bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-lg font-medium transition-all flex items-center justify-center space-x-2"
                >
                  <span>📤</span>
                  <span>Share This Look</span>
                </button>
              </div>
            </div>

            {/* AI Analysis Details */}
            {analysis && (
              <div className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                  <span>🤖</span>
                  <span>AI Analysis</span>
                </h3>
                
                <div className="space-y-2 text-sm">
                  {analysis.height && (
                    <div className="flex justify-between">
                      <span className="text-gray-300">Height:</span>
                      <span className="text-white">{analysis.height}</span>
                    </div>
                  )}
                  {analysis.chest && (
                    <div className="flex justify-between">
                      <span className="text-gray-300">Chest:</span>
                      <span className="text-white">{analysis.chest}</span>
                    </div>
                  )}
                  {analysis.waist && (
                    <div className="flex justify-between">
                      <span className="text-gray-300">Waist:</span>
                      <span className="text-white">{analysis.waist}</span>
                    </div>
                  )}
                  {analysis.shoulders && (
                    <div className="flex justify-between">
                      <span className="text-gray-300">Shoulders:</span>
                      <span className="text-white">{analysis.shoulders}</span>
                    </div>
                  )}
                  {analysis.hips && (
                    <div className="flex justify-between">
                      <span className="text-gray-300">Hips:</span>
                      <span className="text-white">{analysis.hips}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-gray-400 text-sm mb-4">
            Created with Stylin Smart Mirror - AI-Powered Fashion & Style ✨
          </p>
          <button
            onClick={() => navigate('/mirror')}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Create Your Own Look
          </button>
        </div>
      </div>
    </div>
  );
};

export default SharedOutfit;