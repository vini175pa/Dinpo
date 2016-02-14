import WebService from "./WebService";
import io from "socket.io-client";

class ChatWebService extends WebService{
	constructor() {
		super("/visitor");
	}

	onConnect() {
		console.log(this.socket.connected);
	}
}

export default new ChatWebService();
