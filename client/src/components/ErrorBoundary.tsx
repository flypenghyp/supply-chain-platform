import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        <div style={{
          padding: 24,
          fontFamily: 'monospace',
          maxWidth: 800,
          margin: '40px auto',
          background: '#fff2f0',
          border: '1px solid #ffccc7',
          borderRadius: 8,
        }}>
          <h2 style={{ color: '#cf1322' }}>应用加载错误</h2>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: 12 }}>
            {this.state.error.toString()}
          </pre>
          {this.state.error.stack && (
            <details style={{ marginTop: 16 }}>
              <summary>堆栈信息</summary>
              <pre style={{ fontSize: 11, overflow: 'auto', maxHeight: 200 }}>
                {this.state.error.stack}
              </pre>
            </details>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
