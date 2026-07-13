import React from 'react';
import { Row, Col, Button, Input, Select, Space } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';

interface FilterItem {
  type: 'input' | 'select';
  key: string;
  placeholder: string;
  options?: { label: string; value: string }[];
}

interface SearchFilterProps {
  filters: FilterItem[];
  values: Record<string, any>;
  onChange: (key: string, value: any) => void;
  onSearch: () => void;
  onReset: () => void;
  cols?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
  };
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  filters,
  values,
  onChange,
  onSearch,
  onReset,
  cols = { xs: 24, sm: 12, md: 8, lg: 6 }
}) => {
  return (
    <div style={{ marginBottom: 16 }}>
      <Row gutter={[16, 16]}>
        {filters.map((filter) => (
          <Col key={filter.key} xs={cols.xs} sm={cols.sm} md={cols.md} lg={cols.lg}>
            {filter.type === 'input' ? (
              <Input
                placeholder={filter.placeholder}
                allowClear
                value={values[filter.key]}
                onChange={(e) => onChange(filter.key, e.target.value)}
                onPressEnter={onSearch}
                style={{ width: '100%' }}
              />
            ) : (
              <Select
                placeholder={filter.placeholder}
                allowClear
                value={values[filter.key]}
                onChange={(value) => onChange(filter.key, value)}
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
            <Button 
              type="primary" 
              icon={<SearchOutlined />} 
              onClick={onSearch}
              style={{ height: 32, width: 80 }}
            >
              查询
            </Button>
            <Button 
              icon={<ReloadOutlined />} 
              onClick={onReset}
              style={{ height: 32, width: 80 }}
            >
              重置
            </Button>
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default SearchFilter;
