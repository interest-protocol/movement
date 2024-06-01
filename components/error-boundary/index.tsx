import { Component, PropsWithChildren } from 'react';

import Error from '@/views/error';

class ErrorBoundary extends Component<PropsWithChildren> {
  state: {
    hasError: boolean;
  };

  constructor(props: PropsWithChildren) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any, errorInfo: any) {
    console.log({
      error,
      errorInfo,
    });

    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.log({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) return <Error />;

    return this.props.children;
  }
}

export default ErrorBoundary;
