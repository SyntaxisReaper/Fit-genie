const express = require('express');
const Database = require('../models/database');

const router = express.Router();
const db = new Database();

// GET /api/analytics - Get analytics dashboard data
router.get('/', async (req, res) => {
    try {
        const { userId = 1 } = req.query;
        const analytics = await db.getAnalytics(userId);
        
        res.json({
            success: true,
            data: analytics
        });
        
    } catch (error) {
        console.error('Error fetching analytics:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch analytics'
        });
    }
});

// GET /api/analytics/dashboard - Get comprehensive dashboard data
router.get('/dashboard', async (req, res) => {
    try {
        const { userId = 1 } = req.query;
        
        // Get wardrobe items and outfits
        const items = await db.getAllItems(userId);
        const outfits = await db.getAllOutfits(userId);
        
        // Calculate various metrics
        const totalItems = items.length;
        const wornItems = items.filter(item => item.wear_count > 0).length;
        const neverWorn = totalItems - wornItems;
        const efficiency = totalItems > 0 ? Math.round((wornItems / totalItems) * 100) : 0;
        
        // Usage frequency distribution
        const frequently = items.filter(item => item.wear_count > 10).length;
        const occasionally = items.filter(item => item.wear_count > 3 && item.wear_count <= 10).length;
        const rarely = items.filter(item => item.wear_count > 0 && item.wear_count <= 3).length;
        
        // Category breakdown
        const categoryStats = items.reduce((stats, item) => {
            stats[item.category] = (stats[item.category] || 0) + 1;
            return stats;
        }, {});
        
        // Color palette analysis
        const colorStats = items.reduce((stats, item) => {
            stats[item.color] = (stats[item.color] || 0) + 1;
            return stats;
        }, {});
        
        const topColors = Object.entries(colorStats)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([color, count]) => ({
                color,
                count,
                percentage: Math.round((count / totalItems) * 100)
            }));
        
        // Monthly activity (simulated)
        const monthlyData = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            monthlyData.push({
                month: date.toLocaleDateString('en-US', { month: 'short' }),
                outfits: Math.floor(Math.random() * 20) + 10,
                items_added: Math.floor(Math.random() * 5) + 1
            });
        }
        
        // Sustainability metrics
        const totalWears = items.reduce((sum, item) => sum + item.wear_count, 0);
        const averageWears = totalItems > 0 ? Math.round(totalWears / totalItems) : 0;
        const sustainabilityScore = Math.min(100, Math.max(0, 
            (efficiency * 0.4) + (averageWears * 3) + (outfits.length * 2)
        ));
        
        // Most worn items
        const mostWorn = items
            .filter(item => item.wear_count > 0)
            .sort((a, b) => b.wear_count - a.wear_count)
            .slice(0, 5)
            .map(item => ({
                id: item.id,
                name: item.name,
                category: item.category,
                wear_count: item.wear_count,
                last_worn: item.last_worn
            }));
        
        // Least worn items (excluding never worn)
        const leastWorn = items
            .filter(item => item.wear_count > 0)
            .sort((a, b) => a.wear_count - b.wear_count)
            .slice(0, 5)
            .map(item => ({
                id: item.id,
                name: item.name,
                category: item.category,
                wear_count: item.wear_count,
                last_worn: item.last_worn
            }));
        
        const dashboardData = {
            summary: {
                total_items: totalItems,
                worn_items: wornItems,
                never_worn: neverWorn,
                efficiency_percentage: efficiency,
                total_outfits: outfits.length,
                average_wears: averageWears,
                sustainability_score: Math.round(sustainabilityScore)
            },
            usage_distribution: {
                frequently,
                occasionally,
                rarely,
                never_worn: neverWorn
            },
            category_breakdown: Object.entries(categoryStats).map(([category, count]) => ({
                category,
                count,
                percentage: Math.round((count / totalItems) * 100)
            })),
            color_palette: topColors,
            monthly_activity: monthlyData,
            most_worn_items: mostWorn,
            least_worn_items: leastWorn,
            recommendations: [
                neverWorn > 0 ? `You have ${neverWorn} items that haven't been worn yet. Try incorporating them into new outfits!` : null,
                rarely < 5 ? 'Great job utilizing your wardrobe efficiently!' : `Consider donating ${rarely} rarely worn items to make space for pieces you'll love more.`,
                efficiency > 80 ? 'Excellent wardrobe efficiency! You\'re making great use of your clothes.' : 'Try to wear more of your existing items before adding new pieces.',
                topColors.length > 0 ? `Your wardrobe is ${topColors[0].percentage}% ${topColors[0].color}. Consider adding complementary colors for variety.` : null
            ].filter(Boolean)
        };
        
        res.json({
            success: true,
            data: dashboardData
        });
        
    } catch (error) {
        console.error('Error fetching dashboard analytics:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch dashboard analytics'
        });
    }
});

// GET /api/analytics/sustainability - Get sustainability metrics
router.get('/sustainability', async (req, res) => {
    try {
        const { userId = 1 } = req.query;
        const items = await db.getAllItems(userId);
        
        const totalItems = items.length;
        const wornItems = items.filter(item => item.wear_count > 0).length;
        const totalWears = items.reduce((sum, item) => sum + item.wear_count, 0);
        const averageWears = totalItems > 0 ? Math.round(totalWears / totalItems) : 0;
        
        // Calculate sustainability score (0-100)
        const efficiency = totalItems > 0 ? (wornItems / totalItems) * 100 : 0;
        const utilizationScore = Math.min(100, averageWears * 5); // 20 wears = 100 points
        const sustainabilityScore = Math.round((efficiency * 0.6) + (utilizationScore * 0.4));
        
        // Environmental impact estimation (simplified)
        const averageGarmentCO2 = 8.1; // kg CO2 per garment (industry average)
        const carbonFootprint = totalItems * averageGarmentCO2;
        const carbonSavedByReuse = (totalWears - totalItems) * 0.5; // Approx CO2 saved per reuse
        
        const sustainabilityData = {
            score: sustainabilityScore,
            grade: sustainabilityScore >= 90 ? 'A+' :
                   sustainabilityScore >= 80 ? 'A' :
                   sustainabilityScore >= 70 ? 'B+' :
                   sustainabilityScore >= 60 ? 'B' :
                   sustainabilityScore >= 50 ? 'C' : 'D',
            metrics: {
                efficiency_percentage: Math.round(efficiency),
                average_wears: averageWears,
                utilization_score: Math.round(utilizationScore),
                total_wears: totalWears
            },
            environmental_impact: {
                carbon_footprint_kg: Math.round(carbonFootprint),
                carbon_saved_kg: Math.round(Math.max(0, carbonSavedByReuse)),
                water_saved_liters: Math.round(totalWears * 2700), // Approx water saved per wear vs new purchase
                waste_prevented_kg: Math.round(totalWears * 0.3) // Approx textile waste prevented
            },
            badges: [
                wornItems / totalItems > 0.8 ? 'Wardrobe Maximizer' : null,
                averageWears > 15 ? 'Reuse Champion' : null,
                sustainabilityScore > 85 ? 'Eco Warrior' : null,
                items.filter(item => item.wear_count > 20).length > 5 ? 'Sustainability Star' : null
            ].filter(Boolean),
            tips: [
                wornItems / totalItems < 0.7 ? 'Try wearing more of your existing items before buying new ones' : null,
                averageWears < 10 ? 'Aim to wear each item at least 10 times to maximize its value' : null,
                items.filter(item => item.wear_count === 0).length > 5 ? 'Consider donating items you haven\'t worn in over a year' : null,
                'Mix and match existing pieces to create new outfit combinations'
            ].filter(Boolean)
        };
        
        res.json({
            success: true,
            data: sustainabilityData
        });
        
    } catch (error) {
        console.error('Error fetching sustainability metrics:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch sustainability metrics'
        });
    }
});

module.exports = router;