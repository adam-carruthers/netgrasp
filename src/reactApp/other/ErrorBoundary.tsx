import React, { Component } from "react";

export default class ErrorBoundary extends Component<
  unknown,
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="py-4 px-2">
          <h1>Serious Error</h1>
          There was a serious error and the website has crashed. Please contact
          the website provider to fix this issue.
        </div>
      );
    }

    return this.props.children;
  }
}
