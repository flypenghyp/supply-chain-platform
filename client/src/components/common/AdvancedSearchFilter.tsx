import React from 'react';
import { Row, Col, Button, Input, Select, DatePicker, Space } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import type { Dayjs } from 'dayjs';
import './AdvancedSearchFilter.scss';

const { Option } = Select;
const { RangePicker } = DatePicker;

export interface FilterFieldConfig {
  key: string;
  label: string;
  type: 'input' | 'select' | 'datePicker' | 'rangePicker';
  placeholder?: string;
  options?: { label: string; value: any }[];
  colSpan?: { xs?: number; sm?: number; md?: number; lg?: number };
}

interface AdvancedSearchFilterProps {
  fields: FilterFieldConfig[];
  values: Record<string, any>;
  onChange: (key: string, value: any) => void;
  onSearch: () => void;
  onReset: () => void;
  extraActions?: React.ReactNode;
}

const AdvancedSearchFilter: React.FC<AdvancedSearchFilterProps> = ({
  fields,
  values,
  onChange,
  onSearch,
  onReset,
  extraActions
}) => {
  if (!fields || fields.length === 0) {
    return null;
  }

  const renderField = (field: FilterFieldConfig) => {
    const value = values[field.key];

    switch (field.type) {
      case 'input':
        return (
          <Input
            placeholder={field.placeholder || `请输入${field.label}`}
            allowClear
            value={value}
            onChange={(e) => onChange(field.key, e.target.value)}
            onPressEnter={onSearch}
            style={{ width: '100%' }}
          />
        );
      case 'select':
        return (
          <Select
            placeholder={field.placeholder || `请选择${field.label}`}
            allowClear
            value={value}
            onChange={(v) => onChange(field.key, v)}
            style={{ width: '100%' }}
          >
            {field.options?.map((opt) => (
              <Option key={String(opt.value)} value={opt.value}>
                {opt.label}
              </Option>
            ))}
          </Select>
        );
      case 'datePicker':
        return (
          <DatePicker
            placeholder={field.placeholder || `请选择${field.label}`}
            value={value as Dayjs}
            onChange={(d) => onChange(field.key, d)}
            style={{ width: '100%' }}
          />
        );
      case 'rangePicker':
        return (
          <RangePicker
            placeholder={['开始日期', '结束日期']}
            value={value as [Dayjs, Dayjs]}
            onChange={(dates) => onChange(field.key, dates)}
            style={{ width: '100%' }}
          />
        );
      default:
        return null;
    }
  };

  const getDefaultColSpan = () => ({ xs: 24, sm: 12, md: 8, lg: 6 });

  return (
    <div className="advanced-search-filter">
      <div className="filter-card">
        <Row gutter={[16, 16]}>
          {fields.map((field) => {
            const colSpan = field.colSpan || getDefaultColSpan();
            return (
              <Col key={field.key} xs={colSpan.xs} sm={colSpan.sm} md={colSpan.md} lg={colSpan.lg}>
                <div className="filter-item">
                  <span className="filter-label">{field.label}：</span>
                  {renderField(field)}
                </div>
              </Col>
            );
          })}
          <Col span={24}>
            <Space className="filter-actions">
              {extraActions}
              <Button type="primary" icon={<SearchOutlined />} onClick={onSearch}>
                筛选
              </Button>
              <Button icon={<ReloadOutlined />} onClick={onReset}>
                重置
              </Button>
            </Space>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default AdvancedSearchFilter;
