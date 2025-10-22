import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Grid3X3, List, Heart, Shirt } from 'lucide-react';
import { useFitGenie } from '../context/FitGenieContext';
import { ClothingItem } from '../context/FitGenieContext';

const Closet: React.FC = () => {
  const { state, actions } = useFitGenie();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [filteredItems, setFilteredItems] = useState<ClothingItem[]>([]);

  const categories = [
    { id: 'all', label: 'All Items' },
    { id: 'tops', label: 'Tops' },
    { id: 'bottoms', label: 'Bottoms' },
    { id: 'dresses', label: 'Dresses' },
    { id: 'outerwear', label: 'Outerwear' },
    { id: 'footwear', label: 'Footwear' },
    { id: 'accessories', label: 'Accessories' }
  ];

  useEffect(() => {
    if (state.clothingItems.length === 0) {
      actions.loadClothingItems();
    }
  }, []);

  useEffect(() => {
    let filtered = state.clothingItems;

    // Filter by category
    if (activeCategory !== 'all') {
      filtered = filtered.filter(item => item.category === activeCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredItems(filtered);
  }, [state.clothingItems, activeCategory, searchTerm]);

  const getColorClass = (color: string) => {
    const colorMap: { [key: string]: string } = {
      'black': 'bg-black',
      'white': 'bg-white border',
      'blue': 'bg-blue-200',
      'red': 'bg-red-200',
      'green': 'bg-green-200',
      'grey': 'bg-gray-200',
      'gray': 'bg-gray-200',
      'yellow': 'bg-yellow-200',
      'purple': 'bg-purple-200',
      'pink': 'bg-pink-200'
    };
    return colorMap[color.toLowerCase()] || 'bg-gray-200';
  };

  const getIconColor = (color: string) => {
    const colorMap: { [key: string]: string } = {
      'black': 'text-white',
      'white': 'text-gray-400',
      'blue': 'text-blue-600',
      'red': 'text-red-600',
      'green': 'text-green-600',
      'grey': 'text-gray-600',
      'gray': 'text-gray-600',
      'yellow': 'text-yellow-600',
      'purple': 'text-purple-600',
      'pink': 'text-pink-600'
    };
    return colorMap[color.toLowerCase()] || 'text-gray-600';
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 14) return '1 week ago';
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    
    return date.toLocaleDateString();
  };

  const handleToggleFavorite = (id: string) => {
    const item = state.clothingItems.find(i => i.id === id);
    if (item) {
      actions.updateClothingItem(id, { favorite: !item.favorite });
    }
  };

  return (
    <motion.div
      className="min-h-screen p-4 sm:p-6 lg:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">My Closet</h1>
            <p className="text-gray-600">Organize and manage your wardrobe collection</p>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto mt-4 sm:mt-0">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                placeholder="Search items..."
                className="glass-input pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="glass-card p-4">
            <div className="text-2xl font-bold text-gray-800">{state.clothingItems.length}</div>
            <div className="text-sm text-gray-600">Total Items</div>
          </div>
          <div className="glass-card p-4">
            <div className="text-2xl font-bold text-green-600">89%</div>
            <div className="text-sm text-gray-600">Items Worn</div>
          </div>
          <div className="glass-card p-4">
            <div className="text-2xl font-bold text-blue-600">{categories.length - 1}</div>
            <div className="text-sm text-gray-600">Categories</div>
          </div>
          <div className="glass-card p-4">
            <div className="text-2xl font-bold text-purple-600">€2,450</div>
            <div className="text-sm text-gray-600">Total Value</div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="glass-card p-4 mb-8">
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`category-tab ${activeCategory === category.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Clothing Items Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              className="clothing-item group"
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="clothing-item-image">
                <div className={`w-full h-full flex items-center justify-center ${getColorClass(item.color)}`}>
                  <Shirt className={`w-12 h-12 ${getIconColor(item.color)}`} />
                </div>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    className="bg-white/90 hover:bg-white p-2 rounded-full shadow-lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleFavorite(item.id);
                    }}
                  >
                    <Heart className={`w-4 h-4 ${item.favorite ? 'text-red-500 fill-red-500' : 'text-gray-600'}`} />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-sm mb-2">{item.name}</h3>
                <div className="flex justify-between items-center text-xs text-gray-600 mb-2">
                  <span>{item.brand}</span>
                  <span>€{item.price}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
                  <span>Worn {item.timesWorn > 0 ? `${item.timesWorn}×` : 'Never'}</span>
                  <span>{item.timesWorn > 0 ? formatRelativeTime(item.lastWorn) : ''}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {item.tags.map((tag) => (
                    <span key={tag} className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}

          {/* Add Item Card */}
          <motion.div
            className="clothing-item border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-accent hover:bg-accent/10 transition-colors"
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 300 }}
            onClick={() => actions.showNotification('Camera modal coming soon!', 'info')}
          >
            <div className="text-center p-8">
              <Plus className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">Add New Item</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating Action Button */}
      <motion.button
        className="fixed bottom-6 right-6 bg-accent hover:bg-purple-600 text-white p-4 rounded-full shadow-lg z-40"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => actions.showNotification('Camera feature coming soon!', 'info')}
      >
        <Plus className="w-6 h-6" />
      </motion.button>
    </motion.div>
  );
};

export default Closet;