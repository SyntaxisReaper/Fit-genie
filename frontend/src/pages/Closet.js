import React, { useState, useEffect } from 'react';
import apiService from '../services/api';
import { useNotification } from '../contexts/NotificationContext';

const Closet = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [clothingItems, setClothingItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newItem, setNewItem] = useState({
    name: '',
    category: '',
    brand: '',
    color: '',
    image: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const { showSuccess, showError, showInfo } = useNotification();

  const defaultCategories = [
    { id: 'all', name: 'All Items', icon: '👗', count: 47 },
    { id: 'tops', name: 'Tops', icon: '👕', count: 18 },
    { id: 'bottoms', name: 'Bottoms', icon: '👖', count: 12 },
    { id: 'dresses', name: 'Dresses', icon: '👗', count: 8 },
    { id: 'outerwear', name: 'Outerwear', icon: '🧥', count: 5 },
    { id: 'shoes', name: 'Shoes', icon: '👠', count: 14 },
    { id: 'accessories', name: 'Accessories', icon: '👜', count: 9 }
  ];

  // Load data on component mount
  useEffect(() => {
    loadClothingItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]);

  const loadClothingItems = async () => {
    try {
      const items = await apiService.getClothingItems(selectedCategory);
      setClothingItems(items);
      
      // Update category counts
      const updatedCategories = defaultCategories.map(cat => ({
        ...cat,
        count: cat.id === 'all' ? items.length : items.filter(item => item.category === cat.id).length
      }));
      setCategories(updatedCategories);
    } catch (error) {
      console.error('Error loading clothing items:', error);
      // Fallback to default data
      setClothingItems(defaultClothingItems);
      setCategories(defaultCategories);
      showError('Unable to load items from server. Using offline data.');
    } finally {
      // Loading state removed
    }
  };

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddItem = async () => {
    if (!newItem.name || !newItem.category) {
      showError('Please fill in all required fields');
      return;
    }

    try {
      let imageUrl = '';
      
      // Upload image if selected
      if (imageFile) {
        showInfo('Uploading image...');
        const uploadResponse = await apiService.uploadImage(imageFile);
        imageUrl = uploadResponse.url;
      }
      
      const itemData = {
        ...newItem,
        image: imageUrl
      };
      
      const addedItem = await apiService.addClothingItem(itemData);
      setClothingItems(prev => [...prev, addedItem]);
      showSuccess(`${newItem.name} added to your closet!`);
      
      // Reset form
      setNewItem({ name: '', category: '', brand: '', color: '', image: '' });
      setImageFile(null);
      setImagePreview(null);
      setShowAddModal(false);
      loadClothingItems(); // Refresh the list
    } catch (error) {
      console.error('Error adding item:', error);
      showError('Failed to add item. Please try again.');
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await apiService.deleteClothingItem(itemId);
      setClothingItems(prev => prev.filter(item => item.id !== itemId));
      showSuccess('Item removed from your closet');
    } catch (error) {
      console.error('Error deleting item:', error);
      showError('Failed to remove item. Please try again.');
    }
  };

  // Default fallback data
  const defaultClothingItems = [
    { id: 1, name: 'Navy Blue Blazer', category: 'outerwear', color: 'Navy', brand: 'Zara', image: 'https://via.placeholder.com/200x250/1e40af/ffffff?text=Navy+Blazer', tags: ['Professional', 'Formal'] },
    { id: 2, name: 'White Cotton T-shirt', category: 'tops', color: 'White', brand: 'Uniqlo', image: 'https://via.placeholder.com/200x250/ffffff/000000?text=White+T-shirt', tags: ['Casual', 'Basic'] },
    { id: 3, name: 'Black Slim Jeans', category: 'bottoms', color: 'Black', brand: 'Levi\'s', image: 'https://via.placeholder.com/200x250/000000/ffffff?text=Black+Jeans', tags: ['Casual', 'Versatile'] },
    { id: 4, name: 'Red Summer Dress', category: 'dresses', color: 'Red', brand: 'H&M', image: 'https://via.placeholder.com/200x250/dc2626/ffffff?text=Red+Dress', tags: ['Summer', 'Casual'] },
    { id: 5, name: 'White Sneakers', category: 'shoes', color: 'White', brand: 'Adidas', image: 'https://via.placeholder.com/200x250/f3f4f6/1f2937?text=White+Sneakers', tags: ['Casual', 'Sport'] },
    { id: 6, name: 'Brown Leather Jacket', category: 'outerwear', color: 'Brown', brand: 'Mango', image: 'https://via.placeholder.com/200x250/92400e/ffffff?text=Leather+Jacket', tags: ['Edgy', 'Autumn'] },
    { id: 7, name: 'Blue Denim Shirt', category: 'tops', color: 'Blue', brand: 'Gap', image: 'https://via.placeholder.com/200x250/2563eb/ffffff?text=Denim+Shirt', tags: ['Casual', 'Versatile'] },
    { id: 8, name: 'Black High Heels', category: 'shoes', color: 'Black', brand: 'Nine West', image: 'https://via.placeholder.com/200x250/000000/ffffff?text=High+Heels', tags: ['Formal', 'Evening'] }
  ];

  const filteredItems = selectedCategory === 'all' 
    ? clothingItems 
    : clothingItems.filter(item => item.category === selectedCategory);

  const AddItemModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-white">Add New Item</h3>
          <button 
            onClick={() => setShowAddModal(false)}
            className="text-gray-200 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>
        <div className="space-y-4">
          <input 
            type="text" 
            placeholder="Item name" 
            value={newItem.name}
            onChange={(e) => setNewItem({...newItem, name: e.target.value})}
            className="w-full px-3 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 text-white placeholder-gray-300"
          />
          
          <select 
            value={newItem.category}
            onChange={(e) => setNewItem({...newItem, category: e.target.value})}
            className="w-full px-3 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 text-white"
          >
            <option value="">Select category</option>
            <option value="tops">Tops</option>
            <option value="bottoms">Bottoms</option>
            <option value="dresses">Dresses</option>
            <option value="outerwear">Outerwear</option>
            <option value="shoes">Shoes</option>
            <option value="accessories">Accessories</option>
          </select>
          
          <input 
            type="text" 
            placeholder="Brand" 
            value={newItem.brand}
            onChange={(e) => setNewItem({...newItem, brand: e.target.value})}
            className="w-full px-3 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 text-white placeholder-gray-300"
          />
          
          <input 
            type="text" 
            placeholder="Color" 
            value={newItem.color}
            onChange={(e) => setNewItem({...newItem, color: e.target.value})}
            className="w-full px-3 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 text-white placeholder-gray-300"
          />
          
          {/* Image Upload Section */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">Item Image</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-white/30 border-dashed rounded-md hover:border-white/50 transition-colors bg-white/10 backdrop-blur-sm">
              <div className="space-y-1 text-center">
                {imagePreview ? (
                  <div className="mb-4">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="mx-auto h-32 w-32 object-cover rounded-lg"
                    />
                    <button 
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview(null);
                      }}
                      className="mt-2 text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove image
                    </button>
                  </div>
                ) : (
                  <>
                    <svg className="mx-auto h-12 w-12 text-gray-200" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="flex text-sm text-gray-200">
                      <label className="relative cursor-pointer bg-white/20 backdrop-blur-sm rounded-md font-medium text-cyan-400 hover:text-cyan-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-cyan-400 px-2 py-1">
                        <span>Upload a file</span>
                        <input 
                          type="file" 
                          className="sr-only" 
                          accept="image/*"
                          onChange={handleImageSelect}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-300">PNG, JPG, GIF up to 10MB</p>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex space-x-3 pt-4">
            <button 
              onClick={() => {
                setShowAddModal(false);
                setNewItem({ name: '', category: '', brand: '', color: '', image: '' });
                setImageFile(null);
                setImagePreview(null);
              }}
              className="flex-1 px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 text-gray-200 rounded-lg hover:bg-white/30 hover:text-white transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={handleAddItem}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-lg transition-all shadow-lg"
            >
              Add Item
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-4rem-200px)] bg-gradient-to-br from-pink-900 via-purple-800 to-blue-900 py-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-rose-400 to-pink-600 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-violet-400 to-purple-600 rounded-full opacity-20 animate-pulse" style={{animationDelay: '3s'}}></div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white drop-shadow-lg">My Closet 👗</h1>
            <p className="text-gray-200 mt-2 text-lg">Organize and manage your wardrobe</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-medium flex items-center space-x-2 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <span>➕</span>
            <span>Add New Item</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl p-4 text-center hover:scale-105 transition-all duration-300">
            <div className="text-2xl font-bold text-cyan-400">47</div>
            <div className="text-gray-200 text-sm">Total Items</div>
          </div>
          <div className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl p-4 text-center hover:scale-105 transition-all duration-300">
            <div className="text-2xl font-bold text-emerald-400">12</div>
            <div className="text-gray-200 text-sm">Outfits Created</div>
          </div>
          <div className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl p-4 text-center hover:scale-105 transition-all duration-300">
            <div className="text-2xl font-bold text-purple-400">8</div>
            <div className="text-gray-200 text-sm">This Week</div>
          </div>
          <div className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl p-4 text-center hover:scale-105 transition-all duration-300">
            <div className="text-2xl font-bold text-yellow-400">$2,340</div>
            <div className="text-gray-200 text-sm">Total Value</div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'border-pink-400 bg-gradient-to-br from-pink-500/20 to-purple-500/20 text-white shadow-lg'
                    : 'border-white/30 hover:border-white/50 text-gray-200 hover:bg-white/10 hover:scale-105'
                }`}
              >
                <div className="text-2xl mb-2">{category.icon}</div>
                <div className="font-medium text-sm">{category.name}</div>
                <div className="text-xs opacity-75">{category.count} items</div>
              </button>
            ))}
          </div>
        </div>

        {/* Clothing Items Grid */}
        <div className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-white">
              {selectedCategory === 'all' ? 'All Items' : categories.find(c => c.id === selectedCategory)?.name} 
              ({filteredItems.length})
            </h2>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-sm border border-white/30 rounded-md text-gray-200 hover:bg-white/10 hover:text-white transition-all duration-300">
                Sort by Date
              </button>
              <button className="px-3 py-1 text-sm border border-white/30 rounded-md text-gray-200 hover:bg-white/10 hover:text-white transition-all duration-300">
                Filter
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <div key={item.id} className="group cursor-pointer">
                <div className="bg-gray-100 rounded-lg overflow-hidden mb-3 aspect-square relative group-hover:shadow-lg transition-shadow">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="bg-white rounded-full p-2 shadow-lg hover:bg-gray-50">
                      ❤️
                    </button>
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="font-medium text-white">{item.name}</h3>
                  <p className="text-sm text-gray-300">{item.brand}</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                      {item.color}
                    </span>
                    {item.tags.map((tag, index) => (
                      <span key={index} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Item Modal */}
      {showAddModal && <AddItemModal />}
    </div>
  );
};

export default Closet;