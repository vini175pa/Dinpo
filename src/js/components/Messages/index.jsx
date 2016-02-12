import React from 'react';

export default class Messages extends React.Component {

	static willTransitionTo(transition) {
      if (!LoginStore.isLoggedIn()) {
        transition.redirect('/login', {}, {'nextPath' : transition.path});
      }
    }

	render() {
		return (
			<div>Messages</div>
		);
	}
}
