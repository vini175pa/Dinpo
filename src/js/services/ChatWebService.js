import ChatActions from "../actions/ChatActions";
import when from "when";
import WebService from "./WebService";
import io from "socket.io-client";

class ChatWebService extends WebService{

	promises = {};

	constructor() {
		super("/visitor");

		var socket = this.socket,
			self = this;

		socket.on("message: get array", function( rawMessages ) {
			console.log("message: get array", rawMessages);
			ChatActions.receiveMessages( rawMessages );
		});

		socket.on("visitor: get id", function( id ) {
			localStorage.setItem("dinpo:visitorId", id);
		});

	}

	onConnect() {
		console.log(this.socket.connected);
	}

	sendMessage(message) {
		this.socket.emit("message: send", message);
	}

	addToPromise(key, promise) {
		if(!this.promisses[key])
			this.promisses[key] = []

		return this.promisses[key].push(promise);
	}
}

export default new ChatWebService();
