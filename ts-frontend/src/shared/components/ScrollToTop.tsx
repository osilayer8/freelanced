import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class ScrollToTop extends Component<any> {
  componentDidUpdate(prevProps: any) {
    if (this.props.location !== prevProps.location) {
      window.scrollTo(0, 0);
    }
  }

  render() {
    return <React.Fragment />;
  }
}

export default withRouter(ScrollToTop);
