import {ActionTypes} from "../constants/AppConstants";
import BaseStore from "./BaseStore";

export default class TestStore extends BaseStore{

	_data = {};

	constructor(){
		super();
	    this.subscribe(() => this._registerToActions.bind(this));

	    this.events = {
	    	change: this._createEvent("CHANGE")
	    }
	}

	_registerToActions(action) {

		switch(action.type){
			case ActionTypes.TEST:
				break;
			default:

		}
	}
}

export default new TestStore();