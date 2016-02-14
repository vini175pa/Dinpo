import LoginStore from "../stores/LoginStore";
import React from "react";
import {Router, Route, browserHistory, Link} from "react-router";

import App from "../components/App";
import Messages from "../components/Messages";
import Error404 from "../components/Errors/404";
import Login from "../components/Login";

class RouterContainer {

	constructor() {

		this._router = (
			<Router history={browserHistory}>
				<Route component={App}>
					<Route path="/" component={Messages} onEnter={this.isAuthenticated}/>
					<Route path="login" component={Login} />
					<Route path="*" component={Error404}/>
				</Route>

			</Router>
		);
	}

	isAuthenticated(nextState, replace) {
		if (!LoginStore.isLoggedIn()) {
	    replace({
	      pathname: '/login',
	      state: { nextPathname: nextState.location.pathname }
	    })
	  }
	}

	get() {
		return this._router;
	}

	set(router) {
		this._router = router;
	}

}

export default new RouterContainer();