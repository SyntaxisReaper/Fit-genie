import React, { useState, useEffect } from 'react';
import { socialSharingManager } from '../utils/socialSharing';
import { useNotification } from '../contexts/NotificationContext';

const SocialShareModal = ({ isOpen, onClose, outfitData, analysisData, imageBlob }) => {
  const [shareLink, setShareLink] = useState('');
  const [shareData, setShareData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [shareHistory, setShareHistory] = useState([]);
  const [qrCode, setQrCode] = useState('');
  const { showSuccess, showError, showInfo } = useNotification();

  // Social media platforms configuration
  const socialPlatforms = [
    { 
      id: 'twitter', 
      name: 'Twitter', 
      icon: '🐦', 
      color: 'bg-blue-400 hover:bg-blue-500',
      description: 'Tweet your look'
    },
    { 
      id: 'facebook', 
      name: 'Facebook', 
      icon: '📘', 
      color: 'bg-blue-600 hover:bg-blue-700',
      description: 'Share with friends'
    },
    { 
      id: 'instagram', 
      name: 'Instagram', 
      icon: '📷', 
      color: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
      description: 'Post to your feed'
    },
    { 
      id: 'pinterest', 
      name: 'Pinterest', 
      icon: '📌', 
      color: 'bg-red-500 hover:bg-red-600',
      description: 'Pin your style'
    },
    { 
      id: 'whatsapp', 
      name: 'WhatsApp', 
      icon: '💬', 
      color: 'bg-green-500 hover:bg-green-600',
      description: 'Send to contacts'
    },
    { 
      id: 'linkedin', 
      name: 'LinkedIn', 
      icon: '💼', 
      color: 'bg-blue-700 hover:bg-blue-800',
      description: 'Professional share'
    }
  ];

  useEffect(() => {
    if (isOpen && outfitData) {
      generateShareLink();
      loadShareHistory();
    }
  }, [isOpen, outfitData]);

  const generateShareLink = async () => {
    if (!outfitData) return;
    
    setIsGenerating(true);
    try {
      const result = socialSharingManager.generateShareableLink(outfitData, analysisData);
      setShareLink(result.url);
      setShareData(result.data);
      setQrCode(socialSharingManager.generateQRCode(result.url));
      showSuccess('Share link generated!');
    } catch (error) {
      console.error('Error generating share link:', error);
      showError('Failed to generate share link');
    } finally {
      setIsGenerating(false);
    }
  };

  const loadShareHistory = () => {
    const history = socialSharingManager.getShareHistory();
    setShareHistory(history);
  };

  const handleSocialShare = async (platform) => {
    if (!shareData) {
      showError('Share link not ready');
      return;
    }

    try {
      showInfo(`Sharing to ${platform}...`);
      const result = await socialSharingManager.shareToSocialMedia(platform, shareData, imageBlob);
      
      if (result.success) {
        socialSharingManager.trackShare(shareData.id, platform);
        if (result.message) {
          showInfo(result.message);
        } else {
          showSuccess(`Shared to ${platform}!`);
        }
      } else {
        showError(result.error || 'Sharing failed');
      }
    } catch (error) {
      console.error(`Error sharing to ${platform}:`, error);
      showError(`Failed to share to ${platform}`);
    }
  };

  const handleNativeShare = async () => {
    if (!shareData) return;

    try {
      await socialSharingManager.nativeShare(shareData, imageBlob);
      socialSharingManager.trackShare(shareData.id, 'native');
      showSuccess('Shared successfully!');
    } catch (error) {
      console.error('Native sharing failed:', error);
      showInfo('Native sharing not supported on this device');
    }
  };

  const handleCopyLink = async () => {
    if (!shareLink) return;

    try {
      const result = await socialSharingManager.copyToClipboard(shareLink);
      if (result.success) {
        showSuccess(result.message);
      }
    } catch (error) {
      showError('Failed to copy link');
    }
  };

  const handleDownloadImage = () => {
    if (imageBlob) {
      socialSharingManager.downloadImage(imageBlob, `stylin-${outfitData?.name || 'outfit'}.jpg`);
      showSuccess('Image downloaded!');
    } else {
      showError('No image available to download');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 to-purple-900 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
            <span>📤</span>
            <span>Share Your Look</span>
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-xl"
          >
            ✕
          </button>
        </div>

        {/* Outfit Preview */}
        {outfitData && (
          <div className="bg-white/10 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-4">
              <img 
                src={outfitData.thumbnail} 
                alt={outfitData.name}
                className="w-16 h-20 rounded object-cover"
              />
              <div>
                <h3 className="text-white font-semibold">{outfitData.name}</h3>
                <p className="text-gray-300 text-sm">{outfitData.items?.join(' • ')}</p>
                {analysisData && (
                  <div className="flex space-x-2 mt-1">
                    {analysisData.confidence && (
                      <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">
                        {analysisData.confidence}% confidence
                      </span>
                    )}
                    {analysisData.fitScore && (
                      <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded">
                        {analysisData.fitScore}% fit
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Share Link */}
        <div className="bg-white/10 rounded-lg p-4 mb-6">
          <h3 className="text-white font-semibold mb-3 flex items-center space-x-2">
            <span>🔗</span>
            <span>Share Link</span>
          </h3>
          
          {isGenerating ? (
            <div className="flex items-center space-x-2 text-gray-300">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Generating link...</span>
            </div>
          ) : shareLink ? (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={shareLink}
                  readOnly
                  className="flex-1 bg-gray-800 text-white px-3 py-2 rounded text-sm"
                />
                <button
                  onClick={handleCopyLink}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm transition-colors"
                >
                  📋 Copy
                </button>
              </div>
              
              {/* QR Code */}
              {qrCode && (
                <div className="flex justify-center">
                  <div className="bg-white p-2 rounded">
                    <img src={qrCode} alt="QR Code" className="w-24 h-24" />
                    <p className="text-xs text-gray-600 text-center mt-1">Scan to share</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-400">Failed to generate link</p>
          )}
        </div>

        {/* Social Media Platforms */}
        <div className="mb-6">
          <h3 className="text-white font-semibold mb-3 flex items-center space-x-2">
            <span>📱</span>
            <span>Share on Social Media</span>
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {socialPlatforms.map((platform) => (
              <button
                key={platform.id}
                onClick={() => handleSocialShare(platform.id)}
                className={`${platform.color} text-white p-3 rounded-lg transition-all hover:scale-105 flex flex-col items-center space-y-1`}
                disabled={!shareData}
              >
                <span className="text-xl">{platform.icon}</span>
                <span className="font-medium text-sm">{platform.name}</span>
                <span className="text-xs opacity-75">{platform.description}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Additional Actions */}
        <div className="flex flex-wrap gap-3 mb-6">
          {navigator.share && (
            <button
              onClick={handleNativeShare}
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              disabled={!shareData}
            >
              <span>📤</span>
              <span>Native Share</span>
            </button>
          )}
          
          <button
            onClick={handleDownloadImage}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
            disabled={!imageBlob}
          >
            <span>💾</span>
            <span>Download Image</span>
          </button>
        </div>

        {/* Share History */}
        {shareHistory.length > 0 && (
          <div>
            <h3 className="text-white font-semibold mb-3 flex items-center space-x-2">
              <span>📈</span>
              <span>Recent Shares</span>
            </h3>
            
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {shareHistory.slice(0, 5).map((entry) => (
                <div key={entry.id} className="bg-white/5 rounded p-2 flex justify-between items-center">
                  <div>
                    <p className="text-white text-sm font-medium">{entry.outfit}</p>
                    <p className="text-gray-400 text-xs">
                      {new Date(entry.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-300 text-xs">{entry.views} views</p>
                    <p className="text-gray-300 text-xs">{entry.likes} likes</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-white/10 text-center">
          <p className="text-gray-400 text-sm">
            Share your style with the world! ✨ #OOTD #Fashion #AI
          </p>
        </div>
      </div>
    </div>
  );
};

export default SocialShareModal;