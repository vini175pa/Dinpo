import {ActionTypes}  from "../constants/AppConstants";
import BaseStore from './BaseStore';

class LoginStore extends BaseStore {

	_user = null;
	_token = localStorage.getItem("auth_token");

	constructor(){
	    super();
	    this.subscribe(() => this._registerToActions.bind(this));

	    // emit, add, remove
	    this.events = {
	    	change: this._createEvent("CHANGE")
	    }
	}

	_registerToActions(action) {

		switch(action.type){
			case ActionTypes.AUTH_LOGIN:
				var {token, user} = action;

				if( this._token != token)
					localStorage.setItem("auth_token", token);

				this._user = user;
				this._token = token;

				this.events.change.emit()
				break;
			case ActionTypes.AUTH_LOGOUT:
				console.log("LOGOUT");
				this._token = null;
				this._user = null;
				this.events.change.emit()
				localStorage.removeItem("auth_token");
				break;
			default:

		}
	}

	get user() {
		return this._user
	}

	get token() {
		return this._token
	}

	isLoggedIn() {
		return !!this._token;
	}

	isAuthenticated() {
		return !!this._token && !!this._user;
	}

}

export default new LoginStore();
