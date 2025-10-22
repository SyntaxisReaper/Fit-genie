const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        
        // Try to parse error response for more details
        try {
          const errorData = await response.json();
          if (errorData.error) {
            errorMessage = errorData.error;
          } else if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (parseError) {
          // Use default error message if parsing fails
        }
        
        const error = new Error(errorMessage);
        error.status = response.status;
        throw error;
      }
      
      return await response.json();
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        const connectionError = new Error('Unable to connect to server. Please check if the backend is running.');
        connectionError.status = 0;
        throw connectionError;
      }
      
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Clothing Items API (matching backend wardrobe routes)
  async getClothingItems(category = 'all') {
    const response = await this.request(`/wardrobe${category !== 'all' ? `?category=${category}` : ''}`);
    return response.data || [];
  }

  async addClothingItem(itemData) {
    const response = await this.request('/wardrobe', {
      method: 'POST',
      body: {
        name: itemData.name,
        category: itemData.category,
        color: itemData.color,
        brand: itemData.brand,
        image_url: itemData.image,
        tags: []
      },
    });
    return response.data;
  }

  async updateClothingItem(itemId, itemData) {
    const response = await this.request(`/wardrobe/${itemId}`, {
      method: 'PUT',
      body: itemData,
    });
    return response.data;
  }

  async deleteClothingItem(itemId) {
    const response = await this.request(`/wardrobe/${itemId}`, {
      method: 'DELETE',
    });
    return response;
  }

  // Image upload API
  async uploadImage(imageFile) {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const url = `${API_BASE_URL}/upload`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData, // Don't set Content-Type for FormData
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Image upload failed:', error);
      throw error;
    }
  }

  // Outfits API
  async getOutfits() {
    return this.request('/outfits');
  }

  async createOutfit(outfitData) {
    return this.request('/outfits', {
      method: 'POST',
      body: outfitData,
    });
  }

  async updateOutfit(outfitId, outfitData) {
    return this.request(`/outfits/${outfitId}`, {
      method: 'PUT',
      body: outfitData,
    });
  }

  async deleteOutfit(outfitId) {
    return this.request(`/outfits/${outfitId}`, {
      method: 'DELETE',
    });
  }

  // AI Stylist API (using existing recommendations endpoint)
  async generateOutfitRecommendations(preferences) {
    const response = await this.request(`/recommendations?occasion=${preferences.occasion}&weather=current`);
    return response || [];
  }

  async getStylePreferences() {
    // Return default preferences since backend doesn't have this endpoint yet
    return {
      style: 'modern',
      colors: ['blue', 'white', 'black'],
      budget: 'medium'
    };
  }

  async updateStylePreferences(preferences) {
    // For now, just return the preferences (could be stored locally)
    return preferences;
  }

  // Analytics API
  async getAnalytics(timeRange = 'month') {
    return this.request(`/analytics?timeRange=${timeRange}`);
  }

  async getUsageStats(timeRange = 'month') {
    return this.request(`/analytics/usage?timeRange=${timeRange}`);
  }

  async getSustainabilityMetrics() {
    return this.request('/analytics/sustainability');
  }

  // Smart Mirror API
  async startMirrorSession() {
    return this.request('/mirror/start', {
      method: 'POST',
    });
  }

  async stopMirrorSession() {
    return this.request('/mirror/stop', {
      method: 'POST',
    });
  }

  async analyzeFit(imageData) {
    return this.request('/mirror/analyze-fit', {
      method: 'POST',
      body: { image: imageData },
    });
  }

  async saveOutfitPhoto(photoData) {
    return this.request('/mirror/save-photo', {
      method: 'POST',
      body: photoData,
    });
  }

  // Weather API
  async getCurrentWeather() {
    return this.request('/weather');
  }

  // Dashboard API
  async getDashboardData() {
    // Combine multiple API calls for dashboard
    const [wardrobe, outfits, weather] = await Promise.all([
      this.getClothingItems(),
      this.getOutfits(),
      this.getCurrentWeather()
    ]);
    
    return {
      totalItems: wardrobe.length,
      totalOutfits: outfits.length,
      weather,
      recentItems: wardrobe.slice(-5)
    };
  }

  async getRecentActivity() {
    // Mock recent activity - could be enhanced with usage logs from backend
    return [
      { action: 'Added new item', item: 'Navy Blue Blazer', time: '2 hours ago', icon: '➕' },
      { action: 'Created outfit', item: 'Business Casual Look', time: '1 day ago', icon: '✨' },
      { action: 'Used Smart Mirror', item: 'Tried 3 different combinations', time: '2 days ago', icon: '🪞' },
      { action: 'Updated preferences', item: 'Color palette preferences', time: '3 days ago', icon: '🎨' }
    ];
  }

  async getTodayOutfitSuggestion() {
    const recommendations = await this.generateOutfitRecommendations({ occasion: 'casual' });
    return recommendations[0] || null;
  }
}

const apiService = new ApiService();
export default apiService;
