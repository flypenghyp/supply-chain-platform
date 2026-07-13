import React from 'react';
import { Table, Tag, Space, Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface DataTableProps {
  dataSource: any[];
  columns: ColumnsType<any>;
  loading?: boolean;
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize: number) => void;
  };
  rowKey?: string;
  onRow?: (record: any) => { onClick?: () => void };
  scroll?: { x?: number | string; y?: number | string };
  rowSelection?: any;
  size?: 'small' | 'middle' | 'large';
}

const DataTable: React.FC<DataTableProps> = ({
  dataSource,
  columns,
  loading = false,
  pagination,
  rowKey = 'id',
  onRow,
  scroll,
  rowSelection,
  size = 'middle'
}) => {
  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      loading={loading}
      pagination={pagination ? {
        pageSize: pagination.pageSize,
        total: pagination.total,
        current: pagination.current,
        onChange: pagination.onChange,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total) => `共 ${total} 条`,
        pageSizeOptions: ['10', '20', '50', '100'],
        style: { height: 32, marginTop: 0 }
      } : false}
      rowKey={rowKey}
      onRow={onRow}
      scroll={scroll}
      rowSelection={rowSelection}
      size={size}
      style={{ height: size === 'small' ? 52 : size === 'large' ? 72 : 60 }}
    />
  );
};

export default DataTable;
