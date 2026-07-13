import React, { useRef, useEffect, useCallback } from 'react';

interface CaptchaProps {
  value?: string;
  onChange?: (value: string) => void;
  width?: number;
  height?: number;
  length?: number;
}

const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

const Captcha: React.FC<CaptchaProps> = ({
  value = '',
  onChange,
  width = 120,
  height = 40,
  length = 4,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateCode = useCallback(() => {
    let code = '';
    for (let i = 0; i < length; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
  }, [length]);

  const drawCaptcha = useCallback(
    (code: string) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = width;
      canvas.height = height;

      // 背景
      ctx.fillStyle = '#f0f2f5';
      ctx.fillRect(0, 0, width, height);

      // 干扰线
      for (let i = 0; i < 4; i++) {
        ctx.strokeStyle = `rgba(${Math.random() * 150}, ${Math.random() * 150}, ${Math.random() * 150}, 0.5)`;
        ctx.beginPath();
        ctx.moveTo(Math.random() * width, Math.random() * height);
        ctx.lineTo(Math.random() * width, Math.random() * height);
        ctx.stroke();
      }

      // 干扰点
      for (let i = 0; i < 30; i++) {
        ctx.fillStyle = `rgba(${Math.random() * 200}, ${Math.random() * 200}, ${Math.random() * 200}, 0.6)`;
        ctx.beginPath();
        ctx.arc(Math.random() * width, Math.random() * height, 1, 0, 2 * Math.PI);
        ctx.fill();
      }

      // 验证码文字
      const padding = 8;
      const charWidth = (width - padding * 2) / length;

      for (let i = 0; i < code.length; i++) {
        const char = code[i];
        ctx.save();

        const x = padding + i * charWidth + charWidth / 2 - 6;
        const y = height / 2 + 8;
        ctx.translate(x, y);
        ctx.rotate((Math.random() - 0.5) * 0.4);
        ctx.translate(-x, -y);

        ctx.font = `bold ${20 + Math.random() * 6}px Arial`;
        ctx.fillStyle = `rgb(${Math.random() * 80}, ${Math.random() * 80}, ${Math.random() * 100})`;
        ctx.fillText(char, x, y);

        ctx.restore();
      }

      onChange?.(code);
    },
    [width, height, length, onChange]
  );

  const refresh = useCallback(() => {
    const code = generateCode();
    drawCaptcha(code);
  }, [generateCode, drawCaptcha]);

  useEffect(() => {
    refresh();
  }, []);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <canvas
        ref={canvasRef}
        style={{
          cursor: 'pointer',
          border: '1px solid #d9d9d9',
          borderRadius: 4,
          backgroundColor: '#f0f2f5',
        }}
        onClick={refresh}
        title="点击刷新验证码"
      />
    </div>
  );
};

export default Captcha;
