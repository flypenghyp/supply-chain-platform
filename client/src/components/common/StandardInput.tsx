import React from 'react';
import { Input, Form } from 'antd';
import { Col, Row } from 'antd';

interface StandardInputProps {
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  width?: number | '100%';
  responsive?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
  };
  maxLength?: number;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  name?: string;
  colon?: boolean;
}

const StandardInput: React.FC<StandardInputProps> = ({
  label,
  placeholder = '请输入',
  required = false,
  disabled = false,
  value,
  onChange,
  width = 200,
  responsive,
  maxLength,
  prefix,
  suffix,
  name,
  colon = true
}) => {
  const inputElement = (
    <Input
      placeholder={placeholder}
      disabled={disabled}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      maxLength={maxLength}
      prefix={prefix}
      suffix={suffix}
      style={{ width: typeof width === 'number' ? width : '100%' }}
    />
  );

  if (responsive) {
    return (
      <Form.Item
        label={label}
        name={name || label}
        rules={required ? [{ required: true, message: `请输入${label}` }] : []}
        colon={colon}
      >
        <Row gutter={[8, 0]}>
          <Col xs={responsive.xs || 24} sm={responsive.sm || 12} md={responsive.md || 8} lg={responsive.lg || 6}>
            {inputElement}
          </Col>
        </Row>
      </Form.Item>
    );
  }

  return (
    <Form.Item
      label={label}
      name={name || label}
      rules={required ? [{ required: true, message: `请输入${label}` }] : []}
      colon={colon}
      style={{ width: typeof width === 'number' ? width : undefined }}
    >
      {inputElement}
    </Form.Item>
  );
};

export default StandardInput;
