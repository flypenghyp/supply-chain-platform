import React from 'react';
import { Select, Form } from 'antd';
import { Col, Row } from 'antd';

interface Option {
  label: string;
  value: string | number;
}

interface StandardSelectProps {
  label?: string;
  placeholder?: string;
  required?: boolean;
  options: Option[];
  value?: string | number;
  onChange?: (value: string | number) => void;
  width?: number | '100%';
  responsive?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
  };
  disabled?: boolean;
  showSearch?: boolean;
  mode?: 'multiple' | 'tags';
  name?: string;
  allowClear?: boolean;
}

const StandardSelect: React.FC<StandardSelectProps> = ({
  label,
  placeholder = '请选择',
  required = false,
  options,
  value,
  onChange,
  width = 200,
  responsive,
  disabled = false,
  showSearch = false,
  mode,
  name,
  allowClear = true
}) => {
  const selectElement = (
    <Select
      placeholder={placeholder}
      options={options}
      value={value}
      onChange={onChange}
      disabled={disabled}
      showSearch={showSearch}
      mode={mode}
      allowClear={allowClear}
      filterOption={(input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
      }
      style={{ width: typeof width === 'number' ? width : '100%' }}
    />
  );

  if (responsive) {
    return (
      <Form.Item
        label={label}
        name={name || label}
        rules={required ? [{ required: true, message: `请选择${label}` }] : []}
      >
        <Row gutter={[8, 0]}>
          <Col xs={responsive.xs || 24} sm={responsive.sm || 12} md={responsive.md || 8} lg={responsive.lg || 6}>
            {selectElement}
          </Col>
        </Row>
      </Form.Item>
    );
  }

  return (
    <Form.Item
      label={label}
      name={name || label}
      rules={required ? [{ required: true, message: `请选择${label}` }] : []}
      style={{ width: typeof width === 'number' ? width : undefined }}
    >
      {selectElement}
    </Form.Item>
  );
};

export default StandardSelect;
