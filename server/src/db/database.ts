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

    // ============== Phase 1 新增表 ==============

    // 角色表（双层权限 - 功能权限）
    await run(`
      CREATE TABLE IF NOT EXISTS roles (
        id TEXT PRIMARY KEY,
        code TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        description TEXT,
        type TEXT DEFAULT 'custom',  -- 'system' | 'custom'
        permissions TEXT NOT NULL,    -- JSON: ['user:read', 'user:write', 'license:read', 'license:approve']
        status TEXT DEFAULT 'active',
        created_by TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 用户数据权限范围表（双层权限 - 数据权限）
    await run(`
      CREATE TABLE IF NOT EXISTS user_data_scope (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        supplier_code TEXT NOT NULL,
        scope_type TEXT NOT NULL,         -- 'all' | 'region' | 'store' | 'counter'
        scope_ids TEXT NOT NULL,          -- JSON array: ['store_001', 'store_002']
        effective_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        expire_date DATETIME,
        created_by TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES supplier_users(id) ON DELETE CASCADE
      )
    `);

    // 用户角色关联表（多对多）
    await run(`
      CREATE TABLE IF NOT EXISTS user_roles (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        role_id TEXT NOT NULL,
        supplier_code TEXT NOT NULL,
        granted_by TEXT,
        granted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES supplier_users(id) ON DELETE CASCADE,
        FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
        UNIQUE(user_id, role_id, supplier_code)
      )
    `);

    // 证照表（一期基础）
    await run(`
      CREATE TABLE IF NOT EXISTS licenses (
        id TEXT PRIMARY KEY,
        supplier_code TEXT NOT NULL,
        store_id TEXT,                       -- 门店/专柜 ID（可空）
        license_type TEXT NOT NULL,          -- 17 类证照枚举
        license_name TEXT NOT NULL,
        license_no TEXT,                     -- 证照编号
        issue_date DATETIME,                 -- 开始日期
        expire_date DATETIME,                -- 结束日期（null = 长期有效）
        is_permanent INTEGER DEFAULT 0,      -- 1=长期 0=固定
        issuing_authority TEXT,              -- 颁发机构
        image_url TEXT,                      -- 证照图片
        ai_recognized INTEGER DEFAULT 0,     -- 1=AI 识别 0=手动
        ai_raw_data TEXT,                    -- AI 识别的原始 JSON
        status TEXT DEFAULT 'active',        -- active | expired | pending | rejected
        version INTEGER DEFAULT 1,           -- 延期生成新 version
        parent_id TEXT,                      -- 指向原证照（延期时）
        reject_reason TEXT,                  -- 驳回原因
        created_by TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (parent_id) REFERENCES licenses(id) ON DELETE SET NULL
      )
    `);

    // 证照 UNIQUE 索引：单门店同类证照仅一条 active
    await run(`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_licenses_unique
      ON licenses(supplier_code, IFNULL(store_id, ''), license_type)
      WHERE status = 'active' AND is_permanent = 0
    `);

    // 授权委托书表
    await run(`
      CREATE TABLE IF NOT EXISTS authorizations (
        id TEXT PRIMARY KEY,
        supplier_code TEXT NOT NULL,         -- 归属供应商（不绑定单用户）
        submitter_user_id TEXT NOT NULL,     -- 提交人
        submitter_name TEXT NOT NULL,
        submitter_phone TEXT,
        file_url TEXT NOT NULL,              -- PDF/图片地址
        file_type TEXT,                      -- 'pdf' | 'image'
        file_size INTEGER,
        auth_no TEXT,                        -- 授权书编号
        auth_start_date DATETIME,
        auth_end_date DATETIME,
        authorizer_name TEXT,                -- 授权人姓名（被授权方）
        authorizee_name TEXT,                -- 被授权人姓名
        status TEXT DEFAULT 'pending',       -- pending | approved | rejected
        reject_reason TEXT,
        reviewer_id TEXT,
        reviewer_name TEXT,
        review_time DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (submitter_user_id) REFERENCES supplier_users(id) ON DELETE SET NULL
      )
    `);

    // 操作日志表
    await run(`
      CREATE TABLE IF NOT EXISTS operation_logs (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        user_name TEXT NOT NULL,
        supplier_code TEXT NOT NULL,
        module TEXT NOT NULL,                -- 'user' | 'license' | 'super_admin' | 'authorization' | 'permission'
        action TEXT NOT NULL,                -- 'create' | 'update' | 'delete' | 'approve' | 'reject' | 'login' | 'logout'
        target_id TEXT,                      -- 操作对象 ID
        target_type TEXT,                    -- 'user' | 'license' | 'role' | 'authorization'
        detail TEXT,                         -- JSON: 操作详情
        result TEXT DEFAULT 'success',       -- 'success' | 'failed'
        error_message TEXT,
        ip_address TEXT,
        user_agent TEXT,
        operation_time DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 操作日志索引
    await run(`
      CREATE INDEX IF NOT EXISTS idx_operation_logs_user ON operation_logs(user_id, operation_time DESC)
    `);
    await run(`
      CREATE INDEX IF NOT EXISTS idx_operation_logs_supplier ON operation_logs(supplier_code, operation_time DESC)
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
