"use client";

import React from 'react';

type Props = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

type State = {
  hasError: boolean;
  error?: Error;
};

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, info: any) {
    // Log error for diagnostics
    console.error('Unhandled error caught by ErrorBoundary:', error, info);
  }

  render() {
    if (this.state.hasError) {
      // You can customize the fallback UI here
      return (
        <div className="error-boundary" role="alert" aria-label="Something went wrong">
          An unexpected error occurred. Please try again later.
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
