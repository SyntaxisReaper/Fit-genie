const express = require('express');
const Database = require('../models/database');

const router = express.Router();
const db = new Database();

// GET /api/wardrobe - Get all wardrobe items
router.get('/', async (req, res) => {
    try {
        const { userId = 1, category, color, search } = req.query;
        let items = await db.getAllItems(userId);
        
        // Apply filters
        if (category && category !== 'all') {
            items = items.filter(item => item.category === category);
        }
        
        if (color) {
            items = items.filter(item => item.color.toLowerCase().includes(color.toLowerCase()));
        }
        
        if (search) {
            const searchTerm = search.toLowerCase();
            items = items.filter(item => 
                item.name.toLowerCase().includes(searchTerm) ||
                item.tags.some(tag => tag.toLowerCase().includes(searchTerm))
            );
        }
        
        res.json({
            success: true,
            data: items,
            total: items.length
        });
        
    } catch (error) {
        console.error('Error fetching wardrobe items:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch wardrobe items'
        });
    }
});

// GET /api/wardrobe/:id - Get specific item
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const item = await db.getItemById(id);
        
        if (!item) {
            return res.status(404).json({
                success: false,
                error: 'Item not found'
            });
        }
        
        res.json({
            success: true,
            data: item
        });
        
    } catch (error) {
        console.error('Error fetching item:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch item'
        });
    }
});

// POST /api/wardrobe - Add new item
router.post('/', async (req, res) => {
    try {
        const {
            name,
            category,
            color,
            brand,
            size,
            image_url,
            purchase_price,
            tags,
            user_id = 1
        } = req.body;
        
        // Validate required fields
        if (!name || !category || !color) {
            return res.status(400).json({
                success: false,
                error: 'Name, category, and color are required'
            });
        }
        
        const itemData = {
            user_id,
            name: name.trim(),
            category: category.toLowerCase(),
            color: color.toLowerCase(),
            brand: brand || '',
            size: size || '',
            image_url: image_url || '',
            purchase_price: parseFloat(purchase_price) || 0,
            tags: Array.isArray(tags) ? tags : []
        };
        
        const newItem = await db.addItem(itemData);
        
        res.status(201).json({
            success: true,
            data: newItem,
            message: 'Item added successfully'
        });
        
    } catch (error) {
        console.error('Error adding item:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to add item'
        });
    }
});

// PUT /api/wardrobe/:id - Update item
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        
        // Remove ID from update data if present
        delete updateData.id;
        
        const updated = await db.updateItem(id, updateData);
        
        if (!updated) {
            return res.status(404).json({
                success: false,
                error: 'Item not found or no changes made'
            });
        }
        
        // Fetch updated item
        const updatedItem = await db.getItemById(id);
        
        res.json({
            success: true,
            data: updatedItem,
            message: 'Item updated successfully'
        });
        
    } catch (error) {
        console.error('Error updating item:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update item'
        });
    }
});

// DELETE /api/wardrobe/:id - Delete item
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await db.deleteItem(id);
        
        if (!deleted) {
            return res.status(404).json({
                success: false,
                error: 'Item not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Item deleted successfully'
        });
        
    } catch (error) {
        console.error('Error deleting item:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete item'
        });
    }
});

// POST /api/wardrobe/:id/wear - Mark item as worn
router.post('/:id/wear', async (req, res) => {
    try {
        const { id } = req.params;
        const item = await db.getItemById(id);
        
        if (!item) {
            return res.status(404).json({
                success: false,
                error: 'Item not found'
            });
        }
        
        // Update wear count and last worn date
        const updateData = {
            wear_count: item.wear_count + 1,
            last_worn: new Date().toISOString().split('T')[0]
        };
        
        await db.updateItem(id, updateData);
        
        // Log usage
        await db.logUsage(item.user_id, 'item_worn', { item_id: id, item_name: item.name });
        
        const updatedItem = await db.getItemById(id);
        
        res.json({
            success: true,
            data: updatedItem,
            message: 'Item marked as worn'
        });
        
    } catch (error) {
        console.error('Error marking item as worn:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to mark item as worn'
        });
    }
});

// GET /api/wardrobe/stats/categories - Get category statistics
router.get('/stats/categories', async (req, res) => {
    try {
        const { userId = 1 } = req.query;
        const items = await db.getAllItems(userId);
        
        const categoryStats = items.reduce((stats, item) => {
            stats[item.category] = (stats[item.category] || 0) + 1;
            return stats;
        }, {});
        
        const totalItems = items.length;
        const categoryData = Object.entries(categoryStats).map(([category, count]) => ({
            category,
            count,
            percentage: totalItems > 0 ? Math.round((count / totalItems) * 100) : 0
        }));
        
        res.json({
            success: true,
            data: {
                total: totalItems,
                categories: categoryData
            }
        });
        
    } catch (error) {
        console.error('Error fetching category stats:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch category statistics'
        });
    }
});

// GET /api/wardrobe/stats/colors - Get color statistics
router.get('/stats/colors', async (req, res) => {
    try {
        const { userId = 1 } = req.query;
        const items = await db.getAllItems(userId);
        
        const colorStats = items.reduce((stats, item) => {
            stats[item.color] = (stats[item.color] || 0) + 1;
            return stats;
        }, {});
        
        const colorData = Object.entries(colorStats)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10)
            .map(([color, count]) => ({
                color,
                count,
                percentage: Math.round((count / items.length) * 100)
            }));
        
        res.json({
            success: true,
            data: colorData
        });
        
    } catch (error) {
        console.error('Error fetching color stats:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch color statistics'
        });
    }
});

// GET /api/wardrobe/stats/usage - Get usage statistics
router.get('/stats/usage', async (req, res) => {
    try {
        const { userId = 1 } = req.query;
        const items = await db.getAllItems(userId);
        
        const totalItems = items.length;
        const wornItems = items.filter(item => item.wear_count > 0).length;
        const neverWorn = totalItems - wornItems;
        
        // Categorize by wear frequency
        const frequently = items.filter(item => item.wear_count > 10).length;
        const occasionally = items.filter(item => item.wear_count > 3 && item.wear_count <= 10).length;
        const rarely = items.filter(item => item.wear_count > 0 && item.wear_count <= 3).length;
        
        const totalWears = items.reduce((sum, item) => sum + item.wear_count, 0);
        const avgWears = totalItems > 0 ? Math.round(totalWears / totalItems) : 0;
        
        res.json({
            success: true,
            data: {
                total_items: totalItems,
                worn_items: wornItems,
                never_worn: neverWorn,
                efficiency: totalItems > 0 ? Math.round((wornItems / totalItems) * 100) : 0,
                frequency_distribution: {
                    frequently,
                    occasionally, 
                    rarely,
                    never_worn: neverWorn
                },
                average_wears: avgWears,
                total_wears: totalWears
            }
        });
        
    } catch (error) {
        console.error('Error fetching usage stats:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch usage statistics'
        });
    }
});

module.exports = router;