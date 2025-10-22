// Social sharing utilities for outfit photos and links

export class SocialSharingManager {
  constructor() {
    this.shareHistory = JSON.parse(localStorage.getItem('shareHistory') || '[]');
    this.baseUrl = window.location.origin;
  }

  // Generate shareable outfit link with outfit data
  generateShareableLink(outfitData, analysisData = null) {
    const shareId = this.generateShareId();
    const shareData = {
      id: shareId,
      outfit: outfitData,
      analysis: analysisData,
      timestamp: new Date().toISOString(),
      likes: 0,
      views: 0
    };

    // Store in localStorage (in production, would store in backend)
    const sharedOutfits = JSON.parse(localStorage.getItem('sharedOutfits') || '{}');
    sharedOutfits[shareId] = shareData;
    localStorage.setItem('sharedOutfits', JSON.stringify(sharedOutfits));

    const shareUrl = `${this.baseUrl}/shared/${shareId}`;
    this.addToHistory(shareData, shareUrl);
    
    return {
      url: shareUrl,
      id: shareId,
      data: shareData
    };
  }

  // Generate unique share ID
  generateShareId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
  }

  // Get shared outfit data by ID
  getSharedOutfit(shareId) {
    const sharedOutfits = JSON.parse(localStorage.getItem('sharedOutfits') || '{}');
    return sharedOutfits[shareId] || null;
  }

  // Share to social media platforms
  async shareToSocialMedia(platform, shareData, imageBlob = null) {
    const { outfit, analysis } = shareData;
    const shareText = this.generateShareText(outfit, analysis);
    
    switch (platform) {
      case 'twitter':
        return this.shareToTwitter(shareText, shareData.url);
      
      case 'facebook':
        return this.shareToFacebook(shareText, shareData.url);
      
      case 'instagram':
        return this.shareToInstagram(imageBlob, shareText);
      
      case 'pinterest':
        return this.shareToPinterest(shareText, shareData.url, imageBlob);
      
      case 'whatsapp':
        return this.shareToWhatsApp(shareText, shareData.url);
      
      case 'linkedin':
        return this.shareToLinkedIn(shareText, shareData.url);
      
      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }
  }

  // Generate share text based on outfit data
  generateShareText(outfit, analysis) {
    let text = `Check out my ${outfit.name} outfit! ✨`;
    
    if (analysis) {
      text += `\n\nAI Analysis:`;
      if (analysis.confidence) text += ` ${analysis.confidence}% confidence`;
      if (analysis.fitScore) text += ` • ${analysis.fitScore}% fit`;
      if (analysis.styleRating) text += ` • ${analysis.styleRating}/5 style`;
    }
    
    text += `\n\nCreated with Stylin Smart Mirror 🪞 #OOTD #Fashion #AI`;
    return text;
  }

  // Platform-specific sharing methods
  shareToTwitter(text, url) {
    const tweetText = encodeURIComponent(text);
    const tweetUrl = encodeURIComponent(url);
    const shareUrl = `https://twitter.com/intent/tweet?text=${tweetText}&url=${tweetUrl}`;
    return this.openShareWindow(shareUrl);
  }

  shareToFacebook(text, url) {
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`;
    return this.openShareWindow(shareUrl);
  }

  async shareToInstagram(imageBlob, text) {
    if (navigator.share && imageBlob) {
      try {
        const file = new File([imageBlob], 'outfit.jpg', { type: 'image/jpeg' });
        await navigator.share({
          title: 'My Outfit',
          text: text,
          files: [file]
        });
        return { success: true, method: 'native' };
      } catch (error) {
        console.log('Native sharing failed, falling back to download:', error);
      }
    }
    
    // Fallback: Download image with instructions
    if (imageBlob) {
      this.downloadImage(imageBlob, 'stylin-outfit.jpg');
      return { 
        success: true, 
        method: 'download',
        message: 'Image downloaded! Upload to Instagram manually and use the suggested caption.'
      };
    }
    
    return { success: false, error: 'No image available' };
  }

  shareToPinterest(text, url, imageBlob) {
    // For Pinterest, we'd need to upload the image first
    const shareUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(text)}`;
    return this.openShareWindow(shareUrl);
  }

  shareToWhatsApp(text, url) {
    const message = encodeURIComponent(`${text}\n\n${url}`);
    const shareUrl = `https://wa.me/?text=${message}`;
    return this.openShareWindow(shareUrl);
  }

  shareToLinkedIn(text, url) {
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&summary=${encodeURIComponent(text)}`;
    return this.openShareWindow(shareUrl);
  }

  // Copy link to clipboard
  async copyToClipboard(url) {
    try {
      await navigator.clipboard.writeText(url);
      return { success: true, message: 'Link copied to clipboard!' };
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return { success: true, message: 'Link copied to clipboard!' };
    }
  }

  // Native Web Share API
  async nativeShare(shareData, imageBlob = null) {
    if (!navigator.share) {
      throw new Error('Native sharing not supported');
    }

    const shareContent = {
      title: `My ${shareData.outfit.name} Outfit`,
      text: this.generateShareText(shareData.outfit, shareData.analysis),
      url: shareData.url
    };

    // Add image if available and supported
    if (imageBlob && navigator.canShare && navigator.canShare({ files: [new File([imageBlob], 'outfit.jpg')] })) {
      shareContent.files = [new File([imageBlob], 'stylin-outfit.jpg', { type: 'image/jpeg' })];
    }

    return await navigator.share(shareContent);
  }

  // Utility methods
  openShareWindow(url) {
    const width = 600;
    const height = 400;
    const left = (window.innerWidth / 2) - (width / 2);
    const top = (window.innerHeight / 2) - (height / 2);
    
    window.open(
      url,
      'social-share',
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
    );
    
    return { success: true, method: 'popup' };
  }

  downloadImage(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // History management
  addToHistory(shareData, url) {
    const historyEntry = {
      id: shareData.id,
      outfit: shareData.outfit.name,
      url: url,
      timestamp: shareData.timestamp,
      views: 0,
      likes: 0
    };
    
    this.shareHistory.unshift(historyEntry);
    this.shareHistory = this.shareHistory.slice(0, 20); // Keep last 20
    localStorage.setItem('shareHistory', JSON.stringify(this.shareHistory));
  }

  getShareHistory() {
    return this.shareHistory;
  }

  // Analytics (mock - would integrate with real analytics in production)
  trackShare(shareId, platform) {
    console.log(`Share tracked: ${shareId} on ${platform}`);
    // In production: send to analytics service
  }

  trackView(shareId) {
    const sharedOutfits = JSON.parse(localStorage.getItem('sharedOutfits') || '{}');
    if (sharedOutfits[shareId]) {
      sharedOutfits[shareId].views += 1;
      localStorage.setItem('sharedOutfits', JSON.stringify(sharedOutfits));
    }
  }

  // QR Code generation for easy mobile sharing
  generateQRCode(url) {
    // Simple QR code URL using qr-server.com API
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
  }
}

// Export singleton instance
export const socialSharingManager = new SocialSharingManager();