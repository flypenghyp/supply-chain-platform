import React from 'react';
import { DatePicker, Form } from 'antd';
import dayjs from 'dayjs';
import { Col, Row } from 'antd';

interface DateRangePickerProps {
  label?: string;
  placeholder?: [string, string];
  required?: boolean;
  value?: [string, string];
  onChange?: (value: [string, string]) => void;
  width?: number | '100%';
  responsive?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
  };
  disabled?: boolean;
  name?: string;
}

const { RangePicker } = DatePicker;

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  label,
  placeholder = ['开始日期', '结束日期'],
  required = false,
  value,
  onChange,
  width = 240,
  responsive,
  disabled = false,
  name
}) => {
  const pickerElement = (
    <RangePicker
      placeholder={placeholder}
      value={value ? [dayjs(value[0]), dayjs(value[1])] : null}
      onChange={(dates, dateStrings) =>
        onChange?.(dateStrings as [string, string])
      }
      disabled={disabled}
      format="YYYY-MM-DD"
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
            {pickerElement}
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
      {pickerElement}
    </Form.Item>
  );
};

export default DateRangePicker;
