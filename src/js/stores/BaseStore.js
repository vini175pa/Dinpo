import { EventEmitter } from 'events';
import AppDispatcher from '../dispatchers/AppDispatcher';
import assign from "object-assign";

export default class BaseStore extends EventEmitter {

  events = {};

  _createEvent(event, override){
    var self = this;
    return assign({
       "event": event,
         "add": function(fn) { self.on(event, fn); },
      "remove": function(fn) { self.removeListener(event, fn); },
        "emit": function() { self.emit(event); }
    }, override);
  }


  subscribe(actionSubscribe, dispatcher) {

    if(!dispatcher)
      dispatcher = AppDispatcher;

    this._dispatchToken = dispatcher.register(actionSubscribe());
  }

  get dispatchToken() {
    return this._dispatchToken;
  }
}
