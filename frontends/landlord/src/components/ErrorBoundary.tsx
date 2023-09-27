import React, { Component, ErrorInfo } from 'react'
import { showMessage } from 'react-native-flash-message'

interface Props {
  children?: React.ReactNode
}

interface State {
  error?: Error
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {}
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { error }
  }

  override componentDidCatch(error: Error, _errorInfo: ErrorInfo): void {
    showMessage({
      message: error.message ?? 'Something went wrong',
      type: 'danger',
    })
  }

  override render(): React.ReactNode {
    if (this.state.error) {
      // TODO: better UI
      return <h1>{`Something went wrong: ${this.state.error.message}`}</h1>
    }
    return this.props.children
  }
}
