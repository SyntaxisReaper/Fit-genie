const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

class Database {
    constructor() {
        this.dbPath = path.join(__dirname, '../../data/fitgenie.db');
        this.ensureDataDirectory();
        this.init();
    }

    ensureDataDirectory() {
        const dataDir = path.dirname(this.dbPath);
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }
    }

    init() {
        this.db = new sqlite3.Database(this.dbPath, (err) => {
            if (err) {
                console.error('Error opening database:', err);
            } else {
                console.log('📚 Connected to SQLite database');
                this.createTables();
                this.seedSampleData();
            }
        });
    }

    createTables() {
        // Users table
        this.db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                preferences TEXT DEFAULT '{}',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Wardrobe items table
        this.db.run(`
            CREATE TABLE IF NOT EXISTS wardrobe_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER DEFAULT 1,
                name TEXT NOT NULL,
                category TEXT NOT NULL,
                color TEXT NOT NULL,
                brand TEXT,
                size TEXT,
                image_url TEXT,
                purchase_date DATE,
                purchase_price DECIMAL(10,2),
                wear_count INTEGER DEFAULT 0,
                last_worn DATE,
                tags TEXT DEFAULT '[]',
                rfid_tag TEXT UNIQUE,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        `);

        // Outfits table
        this.db.run(`
            CREATE TABLE IF NOT EXISTS outfits (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER DEFAULT 1,
                name TEXT NOT NULL,
                items TEXT NOT NULL,
                rating INTEGER DEFAULT 0,
                weather_condition TEXT,
                occasion TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                last_worn DATE,
                wear_count INTEGER DEFAULT 0,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        `);

        // Sensor data table
        this.db.run(`
            CREATE TABLE IF NOT EXISTS sensor_data (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                wardrobe_id TEXT DEFAULT 'main',
                temperature DECIMAL(5,2),
                humidity DECIMAL(5,2),
                items_detected INTEGER,
                door_status TEXT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Analytics table
        this.db.run(`
            CREATE TABLE IF NOT EXISTS analytics (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER DEFAULT 1,
                metric_name TEXT NOT NULL,
                metric_value TEXT NOT NULL,
                date DATE DEFAULT CURRENT_DATE,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        `);

        // Usage logs table
        this.db.run(`
            CREATE TABLE IF NOT EXISTS usage_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER DEFAULT 1,
                item_id INTEGER,
                outfit_id INTEGER,
                action TEXT NOT NULL,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                metadata TEXT DEFAULT '{}',
                FOREIGN KEY (user_id) REFERENCES users (id),
                FOREIGN KEY (item_id) REFERENCES wardrobe_items (id),
                FOREIGN KEY (outfit_id) REFERENCES outfits (id)
            )
        `);
    }

    seedSampleData() {
        // Check if we already have data
        this.db.get("SELECT COUNT(*) as count FROM wardrobe_items", (err, row) => {
            if (err) {
                console.error('Error checking for existing data:', err);
                return;
            }

            if (row.count === 0) {
                console.log('🌱 Seeding sample data...');
                this.insertSampleItems();
                this.insertSampleOutfits();
            }
        });
    }

    insertSampleItems() {
        const sampleItems = [
            {
                name: 'Blue Denim Jacket',
                category: 'tops',
                color: 'blue',
                brand: 'Levi\'s',
                size: 'M',
                wear_count: 12,
                tags: JSON.stringify(['casual', 'outdoor', 'denim'])
            },
            {
                name: 'Black Jeans',
                category: 'bottoms',
                color: 'black',
                brand: 'H&M',
                size: '32',
                wear_count: 25,
                tags: JSON.stringify(['casual', 'versatile', 'dark'])
            },
            {
                name: 'White Sneakers',
                category: 'footwear',
                color: 'white',
                brand: 'Nike',
                size: '9',
                wear_count: 18,
                tags: JSON.stringify(['casual', 'sports', 'comfortable'])
            },
            {
                name: 'Red Summer Dress',
                category: 'dresses',
                color: 'red',
                brand: 'Zara',
                size: 'S',
                wear_count: 8,
                tags: JSON.stringify(['formal', 'summer', 'elegant'])
            },
            {
                name: 'Navy Blazer',
                category: 'tops',
                color: 'navy',
                brand: 'Uniqlo',
                size: 'M',
                wear_count: 15,
                tags: JSON.stringify(['formal', 'professional', 'versatile'])
            },
            {
                name: 'White Cotton Shirt',
                category: 'tops',
                color: 'white',
                brand: 'Gap',
                size: 'M',
                wear_count: 22,
                tags: JSON.stringify(['formal', 'basic', 'versatile'])
            }
        ];

        const insertStmt = this.db.prepare(`
            INSERT INTO wardrobe_items (name, category, color, brand, size, wear_count, tags)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `);

        sampleItems.forEach(item => {
            insertStmt.run(item.name, item.category, item.color, item.brand, item.size, item.wear_count, item.tags);
        });

        insertStmt.finalize();
    }

    insertSampleOutfits() {
        const sampleOutfits = [
            {
                name: 'Casual Weekend',
                items: JSON.stringify([1, 2, 3]), // IDs of wardrobe items
                rating: 85,
                weather_condition: 'sunny',
                occasion: 'casual'
            },
            {
                name: 'Professional Meeting',
                items: JSON.stringify([5, 2]), // Navy blazer + black jeans
                rating: 92,
                weather_condition: 'cloudy',
                occasion: 'professional'
            }
        ];

        const insertStmt = this.db.prepare(`
            INSERT INTO outfits (name, items, rating, weather_condition, occasion)
            VALUES (?, ?, ?, ?, ?)
        `);

        sampleOutfits.forEach(outfit => {
            insertStmt.run(outfit.name, outfit.items, outfit.rating, outfit.weather_condition, outfit.occasion);
        });

        insertStmt.finalize();
    }

    // Wardrobe Items Methods
    getAllItems(userId = 1) {
        return new Promise((resolve, reject) => {
            this.db.all(
                "SELECT * FROM wardrobe_items WHERE user_id = ? ORDER BY created_at DESC",
                [userId],
                (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        // Parse JSON fields
                        const items = rows.map(row => ({
                            ...row,
                            tags: JSON.parse(row.tags || '[]')
                        }));
                        resolve(items);
                    }
                }
            );
        });
    }

    getItemById(id) {
        return new Promise((resolve, reject) => {
            this.db.get(
                "SELECT * FROM wardrobe_items WHERE id = ?",
                [id],
                (err, row) => {
                    if (err) {
                        reject(err);
                    } else if (row) {
                        row.tags = JSON.parse(row.tags || '[]');
                        resolve(row);
                    } else {
                        resolve(null);
                    }
                }
            );
        });
    }

    addItem(itemData) {
        return new Promise((resolve, reject) => {
            const {
                user_id = 1,
                name,
                category,
                color,
                brand = '',
                size = '',
                image_url = '',
                purchase_price = 0,
                tags = []
            } = itemData;

            this.db.run(`
                INSERT INTO wardrobe_items 
                (user_id, name, category, color, brand, size, image_url, purchase_price, tags)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [user_id, name, category, color, brand, size, image_url, purchase_price, JSON.stringify(tags)],
            function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id: this.lastID, ...itemData });
                }
            });
        });
    }

    updateItem(id, itemData) {
        return new Promise((resolve, reject) => {
            const fields = [];
            const values = [];

            Object.keys(itemData).forEach(key => {
                if (key !== 'id') {
                    fields.push(`${key} = ?`);
                    values.push(key === 'tags' ? JSON.stringify(itemData[key]) : itemData[key]);
                }
            });

            if (fields.length === 0) {
                resolve(null);
                return;
            }

            values.push(id);
            fields.push('updated_at = CURRENT_TIMESTAMP');

            this.db.run(
                `UPDATE wardrobe_items SET ${fields.join(', ')} WHERE id = ?`,
                values,
                function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(this.changes > 0);
                    }
                }
            );
        });
    }

    deleteItem(id) {
        return new Promise((resolve, reject) => {
            this.db.run(
                "DELETE FROM wardrobe_items WHERE id = ?",
                [id],
                function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(this.changes > 0);
                    }
                }
            );
        });
    }

    // Outfits Methods
    getAllOutfits(userId = 1) {
        return new Promise((resolve, reject) => {
            this.db.all(
                "SELECT * FROM outfits WHERE user_id = ? ORDER BY created_at DESC",
                [userId],
                (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        const outfits = rows.map(row => ({
                            ...row,
                            items: JSON.parse(row.items || '[]')
                        }));
                        resolve(outfits);
                    }
                }
            );
        });
    }

    addOutfit(outfitData) {
        return new Promise((resolve, reject) => {
            const {
                user_id = 1,
                name,
                items,
                rating = 0,
                weather_condition = '',
                occasion = ''
            } = outfitData;

            this.db.run(`
                INSERT INTO outfits (user_id, name, items, rating, weather_condition, occasion)
                VALUES (?, ?, ?, ?, ?, ?)
            `, [user_id, name, JSON.stringify(items), rating, weather_condition, occasion],
            function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id: this.lastID, ...outfitData });
                }
            });
        });
    }

    // Analytics Methods
    getAnalytics(userId = 1) {
        return new Promise((resolve, reject) => {
            this.db.all(
                "SELECT * FROM analytics WHERE user_id = ? ORDER BY date DESC",
                [userId],
                (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                }
            );
        });
    }

    // Sensor Data Methods
    addSensorData(sensorData) {
        return new Promise((resolve, reject) => {
            const {
                wardrobe_id = 'main',
                temperature,
                humidity,
                items_detected,
                door_status = 'closed'
            } = sensorData;

            this.db.run(`
                INSERT INTO sensor_data (wardrobe_id, temperature, humidity, items_detected, door_status)
                VALUES (?, ?, ?, ?, ?)
            `, [wardrobe_id, temperature, humidity, items_detected, door_status],
            function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id: this.lastID, ...sensorData });
                }
            });
        });
    }

    getLatestSensorData() {
        return new Promise((resolve, reject) => {
            this.db.get(
                "SELECT * FROM sensor_data ORDER BY timestamp DESC LIMIT 1",
                (err, row) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(row);
                    }
                }
            );
        });
    }

    // Usage logging
    logUsage(userId, action, metadata = {}) {
        return new Promise((resolve, reject) => {
            this.db.run(`
                INSERT INTO usage_logs (user_id, action, metadata)
                VALUES (?, ?, ?)
            `, [userId, action, JSON.stringify(metadata)],
            function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id: this.lastID });
                }
            });
        });
    }

    close() {
        return new Promise((resolve) => {
            this.db.close((err) => {
                if (err) {
                    console.error('Error closing database:', err);
                } else {
                    console.log('Database connection closed');
                }
                resolve();
            });
        });
    }
}

module.exports = Database;