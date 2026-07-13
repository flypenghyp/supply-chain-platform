import React from 'react';
import { Card, Row, Col, Button, Input, Select, Space, Alert } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';

interface FilterConfig {
  key: string;
  type: 'input' | 'select';
  placeholder: string;
  options?: { label: string; value: string }[];
}

interface SearchModuleProps {
  filters: FilterConfig[];
  filterValues: Record<string, any>;
  onFilterChange: (key: string, value: any) => void;
  onSearch: () => void;
  onReset: () => void;
  alertMessage?: {
    message: string;
    description?: string;
  };
  cols?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
  };
  showResetButton?: boolean;
  extraButtons?: React.ReactNode;
}

const SearchModule: React.FC<SearchModuleProps> = ({
  filters,
  filterValues,
  onFilterChange,
  onSearch,
  onReset,
  alertMessage,
  cols = { xs: 24, sm: 12, md: 6, lg: 4 },
  showResetButton = true,
  extraButtons
}) => {
  return (
    <Card style={{ marginBottom: '24px' }}>
      {alertMessage && (
        <Alert
          message={alertMessage.message}
          description={alertMessage.description}
          type="info"
          showIcon
          style={{ marginBottom: '24px' }}
        />
      )}

      <div
        style={{
          marginBottom: '24px',
          padding: '20px',
          backgroundColor: '#fafafa',
          borderRadius: '4px',
          border: '1px solid #e8e8e8'
        }}
      >
        <Row gutter={[16, 16]}>
          {filters.map((filter) => (
            <Col key={filter.key} xs={cols.xs} sm={cols.sm} md={cols.md} lg={cols.lg}>
              {filter.type === 'input' ? (
                <Input
                  placeholder={filter.placeholder}
                  value={filterValues[filter.key]}
                  onChange={(e) => onFilterChange(filter.key, e.target.value)}
                  allowClear
                  style={{ width: '100%' }}
                />
              ) : (
                <Select
                  placeholder={filter.placeholder}
                  value={filterValues[filter.key]}
                  onChange={(value) => onFilterChange(filter.key, value)}
                  allowClear
                  style={{ width: '100%' }}
                >
                  {filter.options?.map((opt) => (
                    <Select.Option key={opt.value} value={opt.value}>
                      {opt.label}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Col>
          ))}
          <Col xs={24} sm={24} md={24} lg={24}>
            <Space style={{ float: 'right' }}>
              {extraButtons}
              <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={onSearch}
                style={{ height: 32, width: 80 }}
              >
                查询
              </Button>
              {showResetButton && (
                <Button
                  icon={<ReloadOutlined />}
                  onClick={onReset}
                  style={{ height: 32, width: 80 }}
                >
                  重置
                </Button>
              )}
            </Space>
          </Col>
        </Row>
      </div>
    </Card>
  );
};

export default SearchModule;
