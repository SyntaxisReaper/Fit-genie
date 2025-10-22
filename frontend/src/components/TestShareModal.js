import React from 'react';

const TestShareModal = ({ isOpen, onClose, outfitData }) => {
  console.log('TestShareModal render:', { isOpen, outfitData });

  if (!isOpen) return null;

  const handleShare = (platform) => {
    console.log(`Sharing to ${platform}`, outfitData);
    alert(`Sharing to ${platform}: ${outfitData?.name || 'No outfit'}`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Share Your Look</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-xl"
          >
            ✕
          </button>
        </div>

        {outfitData ? (
          <div className="mb-4">
            <h3 className="text-white font-semibold">{outfitData.name}</h3>
            <p className="text-gray-300 text-sm">{outfitData.items?.join(' • ')}</p>
          </div>
        ) : (
          <div className="mb-4 text-gray-400">No outfit selected</div>
        )}

        <div className="space-y-2">
          <button
            onClick={() => handleShare('Twitter')}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
          >
            🐦 Share on Twitter
          </button>
          
          <button
            onClick={() => handleShare('Facebook')}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded transition-colors"
          >
            📘 Share on Facebook
          </button>
          
          <button
            onClick={() => {
              const shareText = `Check out my ${outfitData?.name || 'outfit'}! Created with Stylin Smart Mirror 🪞`;
              if (navigator.share) {
                navigator.share({
                  title: 'My Outfit',
                  text: shareText
                });
              } else {
                navigator.clipboard.writeText(shareText);
                alert('Text copied to clipboard!');
              }
            }}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition-colors"
          >
            📤 Native Share / Copy
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestShareModal;