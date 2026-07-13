import React from 'react';
import { Pagination } from 'antd';

interface TablePaginationProps {
  current: number;
  pageSize: number;
  total: number;
  onChange: (page: number, pageSize: number) => void;
  showSizeChanger?: boolean;
  showQuickJumper?: boolean;
}

const TablePagination: React.FC<TablePaginationProps> = ({
  current,
  pageSize,
  total,
  onChange,
  showSizeChanger = true,
  showQuickJumper = true
}) => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'flex-end',
      padding: '16px 0',
      height: 32
    }}>
      <Pagination
        current={current}
        pageSize={pageSize}
        total={total}
        onChange={onChange}
        showSizeChanger={showSizeChanger}
        showQuickJumper={showQuickJumper}
        showTotal={(total) => `共 ${total} 条`}
        pageSizeOptions={['10', '20', '50', '100']}
      />
    </div>
  );
};

export default TablePagination;
