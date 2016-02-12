import {ActionTypes}  from "../constants/AppConstants";
import BaseStore from './BaseStore';

class LoginStore extends BaseStore {

	_user = null;

	constructor(){
	    super();
	    this.subscribe(() => this._registerToActions.bind(this));

	    // emit, add, remove
	    this.events = {
	    	change: this._createEvent("CHANGE"),
	    	loginFailed: this._createEvent("LOGIN_FAILED")
	    }
	}

	_registerToActions(action) {
		switch(action.type){
			case ActionTypes.LOGIN_RESPONSE:
				if(action.error || !action.user)
					this.events.loginFailed.emit(action.error);
				else{
					this._user = action.user;
					this.events.change.emit();
				}
				break;
			case ActionTypes.LOGOUT:
				this._user = null;
				this.events.change.emit();
				break;
			default:

		}
	}

	get user() {
		return this._user
	}

	isLoggedIn() {
		return !!this._user;
	}

}

export default new LoginStore();
