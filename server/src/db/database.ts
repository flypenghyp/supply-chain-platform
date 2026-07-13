import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = process.env.DATABASE_PATH || path.join(__dirname, '../../data/supply-chain.db');

class Database {
  private db: sqlite3.Database | null = null;

  async initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(DB_PATH, (err: Error | null) => {
        if (err) {
          reject(err);
        } else {
          this.createTables().then(resolve).catch(reject);
        }
      });
    });
  }

  private async createTables(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const run = promisify(this.db!.run.bind(this.db));

    // Suppliers table
    await run(`
      CREATE TABLE IF NOT EXISTS suppliers (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        phone TEXT NOT NULL,
        address TEXT NOT NULL,
        city TEXT NOT NULL,
        country TEXT NOT NULL,
        status TEXT DEFAULT 'active',
        rating REAL DEFAULT 0,
        is_super_admin INTEGER DEFAULT 0,
        business_license TEXT,
        super_admin_phone TEXT,
        super_admin_role TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Products table
    await run(`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        supplier_id TEXT NOT NULL,
        name TEXT NOT NULL,
        sku TEXT NOT NULL UNIQUE,
        category TEXT NOT NULL,
        unit_price REAL NOT NULL,
        stock_quantity INTEGER DEFAULT 0,
        min_order_qty INTEGER DEFAULT 1,
        lead_time_days INTEGER DEFAULT 7,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
      )
    `);

    // Orders table
    await run(`
      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        order_number TEXT NOT NULL UNIQUE,
        supplier_id TEXT NOT NULL,
        total_amount REAL NOT NULL,
        status TEXT DEFAULT 'pending',
        order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        delivery_date DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
      )
    `);

    // Order items table
    await run(`
      CREATE TABLE IF NOT EXISTS order_items (
        id TEXT PRIMARY KEY,
        order_id TEXT NOT NULL,
        product_id TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        unit_price REAL NOT NULL,
        subtotal REAL NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(id),
        FOREIGN KEY (product_id) REFERENCES products(id)
      )
    `);

    // Analytics data table
    await run(`
      CREATE TABLE IF NOT EXISTS analytics (
        id TEXT PRIMARY KEY,
        metric_type TEXT NOT NULL,
        metric_name TEXT NOT NULL,
        metric_value REAL NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Supplier users table
    await run(`
      CREATE TABLE IF NOT EXISTS supplier_users (
        id TEXT PRIMARY KEY,
        supplier_code TEXT NOT NULL,
        name TEXT NOT NULL,
        phone TEXT NOT NULL UNIQUE,
        email TEXT,
        role TEXT NOT NULL,
        role_name TEXT NOT NULL,
        role_type TEXT DEFAULT 'custom',
        status TEXT DEFAULT 'active',
        permissions TEXT,
        data_scope TEXT,
        created_by TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_login_time DATETIME
      )
    `);

    // Super admin change logs table
    await run(`
      CREATE TABLE IF NOT EXISTS super_admin_change_logs (
        id TEXT PRIMARY KEY,
        supplier_code TEXT NOT NULL,
        old_admin_id TEXT,
        old_admin_name TEXT,
        old_admin_phone TEXT,
        new_admin_id TEXT,
        new_admin_name TEXT,
        new_admin_phone TEXT,
        operator_id TEXT,
        operator_name TEXT,
        operation_time DATETIME DEFAULT CURRENT_TIMESTAMP,
        operation_ip TEXT,
        operation_device TEXT,
        reason TEXT,
        verify_method TEXT DEFAULT 'sms_code',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Verify codes table
    await run(`
      CREATE TABLE IF NOT EXISTS verify_codes (
        id TEXT PRIMARY KEY,
        phone TEXT NOT NULL,
        code TEXT NOT NULL,
        type TEXT NOT NULL,
        supplier_code TEXT,
        expire_time DATETIME NOT NULL,
        used INTEGER DEFAULT 0,
        used_time DATETIME,
        fail_count INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Supplier esign info table
    await run(`
      CREATE TABLE IF NOT EXISTS supplier_esign_info (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL UNIQUE,
        supplier_code TEXT NOT NULL,
        real_name TEXT NOT NULL,
        phone TEXT NOT NULL,
        id_card TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        verified INTEGER DEFAULT 0,
        verified_at DATETIME,
        verified_by TEXT,
        enabled INTEGER DEFAULT 0,
        granted_at DATETIME,
        granted_by TEXT,
        reject_reason TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Supplier esign logs table
    await run(`
      CREATE TABLE IF NOT EXISTS supplier_esign_logs (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        supplier_code TEXT NOT NULL,
        action TEXT NOT NULL,
        action_time DATETIME DEFAULT CURRENT_TIMESTAMP,
        action_ip TEXT,
        action_device TEXT,
        result TEXT,
        reason TEXT,
        real_name TEXT,
        phone TEXT,
        id_card TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Database tables created successfully');
  }

  async run(sql: string, params: any[] = []): Promise<any> {
    if (!this.db) throw new Error('Database not initialized');
    
    return new Promise((resolve, reject) => {
      this.db!.run(sql, params, function(this: any, err: Error | null) {
        if (err) reject(err);
        else resolve({ id: this.lastID, changes: this.changes });
      });
    });
  }

  async get(sql: string, params: any[] = []): Promise<any> {
    if (!this.db) throw new Error('Database not initialized');
    
    return new Promise((resolve, reject) => {
      this.db!.get(sql, params, (err: Error | null, row: any) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  async all(sql: string, params: any[] = []): Promise<any[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    return new Promise((resolve, reject) => {
      this.db!.all(sql, params, (err: Error | null, rows: any[]) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });
  }

  async close(): Promise<void> {
    if (!this.db) return;
    
    return new Promise<void>((resolve, reject) => {
      this.db!.close((err: Error | null) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
}

export const db = new Database();
