import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error: error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary 捕获到错误：', error)
    console.error('组件堆栈：', errorInfo.componentStack)
  }

  render(): ReactNode {
    if (this.state.hasError)
      return (
        <div className="error-fallback">
          <h2>出错了</h2>
          <p>{this.state.error?.message}</p>
          <button onClick={() => window.location.reload()}>刷新页面</button>
        </div>
      )

    return this.props.children
  }
}

export default ErrorBoundary
