# 零售商后台 - Framer 组件结构

## 页面清单

### 1. 工作台 (Dashboard)
```
Dashboard
├── Row (统计卡片)
│   ├── Card > Statistic (本月订单总额)
│   ├── Card > Statistic (待审批订单)
│   ├── Card > Statistic (活跃供应商)
│   └── Card > Statistic (订单准时率)
├── Row
│   ├── Card > List (待办事项)
│   └── Card > Table (品类订单统计)
└── Card > Table (最近供应商)
```

### 2. 财务中心 (FinanceCenter)
```
FinanceCenter
├── Row (统计卡片)
│   ├── Card > Statistic (本月应付总额)
│   ├── Card > Statistic (已付款金额)
│   ├── Card > Statistic (待确认对账单)
│   └── Card > Statistic (待收发票)
└── Card > Tabs
    ├── Tab: 对账管理
    │   ├── Filter (日期/供应商/状态)
    │   └── Table (对账单列表)
    ├── Tab: 发票管理
    │   └── Table (发票列表)
    └── Tab: 付款管理
        └── Table (付款列表)
```

### 3. 企业中心 (EnterpriseCenter)
```
EnterpriseCenter
└── Card > Tabs
    ├── Tab: 企业信息
    │   └── Descriptions (企业基本信息)
    ├── Tab: 组织架构
    │   ├── Col > Tree (部门结构)
    │   └── Col > Descriptions (部门详情)
    ├── Tab: 员工管理
    │   ├── Filter (搜索/部门/状态)
    │   └── Table (员工列表)
    └── Tab: 角色权限
        ├── Col > List (角色列表)
        └── Col > Tree (权限配置)
```

### 4. 合同管理 (ContractManagement)
```
ContractManagement
├── Row (统计卡片)
│   ├── Card (生效中合同)
│   ├── Card (待审批合同)
│   ├── Card (即将到期)
│   └── Card (合同总金额)
└── Card
    ├── Tabs (全部/草稿/待审批/生效中/已过期)
    ├── Filter (搜索/供应商/类型/日期)
    └── Table (合同列表)
```

### 5. 订单管理 (OrderManagement)
```
OrderManagement
├── Card
│   ├── Tabs (全部/待审批/已审批/已完成)
│   ├── Filter (搜索/供应商/状态)
│   └── Table (订单列表)
│       └── 列: 订单号/供应商/品类/金额/状态/操作
└── Drawer (订单详情 - 右侧抽屉)
    ├── Descriptions (单头信息)
    └── Table (订单明细 - 单身)
```

### 6. 发货管理 (ShipmentManagement)
```
ShipmentManagement
├── Card
│   ├── Tabs (全部/待发货/运输中/已送达)
│   └── Table (发货单列表)
└── Drawer (发货详情)
    ├── Descriptions (发货信息)
    ├── Timeline (物流轨迹)
    └── Table (发货明细)
```

### 7. 供应商管理 (SupplierManagement)
```
SupplierManagement
├── Card
│   ├── Filter (搜索/品类/状态)
│   └── Table (供应商列表)
└── Drawer (供应商详情)
    └── Descriptions (供应商信息)
```

---

## Framer 重建建议

### 布局组件映射
| Ant Design | Framer |
|------------|--------|
| Layout, Sider | Frame + 固定宽度 |
| Header | Frame + 固定高度 |
| Content | Frame + Auto Layout |
| Card | Frame + 圆角 + 阴影 |
| Table | Stack + 多个 Frame 行 |
| Drawer | Frame + 动画滑入 |

### 颜色 Token (Ant Design 默认)
```
主色: #1890ff
成功: #52c41a
警告: #faad14
错误: #f5222d
文本: #000000d9 (主) / #00000073 (次)
边框: #d9d9d9
背景: #f0f2f5
```

### 字体
```
中文: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto
英文: Inter, SF Pro
字号: 12px / 14px / 16px / 18px / 20px
```

---

## 快速导入步骤

1. 打开 Framer，新建项目
2. 创建页面：Dashboard / Finance / Enterprise / Contract / Orders / Shipments / Suppliers
3. 按上述结构逐层添加组件
4. 应用颜色 Token 和字体
5. 添加交互（页面跳转、抽屉动画）
