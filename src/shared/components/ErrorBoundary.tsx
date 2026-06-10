import React, { Component, ErrorInfo, ReactNode } from 'react'

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
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback
      return (
        <div className="flex flex-col items-center justify-center h-screen bg-black px-8 gap-6 text-center">
          <span className="text-6xl">🐇</span>
          <h2 className="text-white text-2xl font-bold">Something went wrong</h2>
          <p className="text-[#8E8E93] text-sm">{this.state.error?.message}</p>
          <button
            onClick={this.handleReset}
            className="bg-[#FF375F] text-white px-6 py-3 rounded-squircle min-h-[44px] font-medium active:scale-95 transition-transform"
          >
            Try again
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary
