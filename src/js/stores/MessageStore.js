import {ActionTypes} from "../constants/AppConstants";
import BaseStore from "./BaseStore";

export default class MessageStore extends BaseStore{

	_messages = {};

	constructor(){
		super();
	    this.subscribe(() => this._registerToActions.bind(this));

	    this.events = {
	    	change: this._createEvent("CHANGE")
	    }
	}

	_registerToActions(action) {
		var self = this;

		switch(action.type){
			case ActionTypes.RECEIVE_MESSAGES:

				action.messages.forEach( (message) => {

					message.id = message.id || message._id || null;

					if( message.fakeId && !message.sending ) {
						delete self._messages[ message.fakeId ];
					}

					if( !message.id ) return;

					self._messages[message.id] = message;
				});

				this.events.change.emit();

				break;
			default:

		}
	}

	getMessages() {
		var messages = [];

		for ( var id in this._messages) {
			messages.push(this._messages[id]);
		}

		return messages;
	}
}

export default new MessageStore();