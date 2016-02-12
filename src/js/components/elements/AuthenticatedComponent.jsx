import React from 'react';
import LoginStore from '../stores/LoginStore';

export default (ComposedComponent) => {
  return class AuthenticatedComponent extends React.Component {

    static willTransitionTo(transition) {
      // if (!LoginStore.isLoggedIn()) {
      //   transition.redirect('/login', {}, {'nextPath' : transition.path});
      // }
    }

    constructor() {
      super()
      this.state = this._getLoginState();
    }

    _getLoginState() {
      return {
        userLoggedIn: LoginStore.isLoggedIn(),
        user: LoginStore.user,
        token: LoginStore.token
      };
    }

    componentDidMount() {
      this.changeListener = this._onChange.bind(this);

      // Add listener
      LoginStore.events.change.add(this.changeListener);
    }

    componentWillUnmount() {
      LoginStore.evetns.change.remove(this.changeListener);
    }

    _onChange() {
      this.setState(this._getLoginState());
    }


    render() {
      return (
      <ComposedComponent
        {...this.props}
        user={this.state.user}
        token={this.state.token}
        userLoggedIn={this.state.userLoggedIn} />
      );
    }
  }
};