import io from "socket.io-client";

export default class WebService{

	socket = null;

	constructor( namespace, options, connect ){

		connect = !(connect === false);

		this.url = "localhost:3000" + namespace;

		var socket = this.socket = io.connect(this.url, options || {
			reconnection: false,
			autoConnect: false
		});


		if( connect ){
			this.connect();
		}


		socket.on("connect", this.onConnect.bind(this));
		socket.on("error", this.onError.bind(this) );
		socket.on("disconnect", this.onError.bind(this) );
		socket.on("reconnecting", this.onReconnecting.bind(this) );
		socket.on("reconnect_error", this.onReconnectionError.bind(this) );
		socket.on("reconnect", this.onReconnect.bind(this) );



	}

	onConnect () { console.info("Socket connected"); }
	onError ( error ) { console.error( error ); }
	onDisconnect () { console.info("Socket disconnected"); }
	onReconnect () { console.info("Socket reconnected"); }
	onReconnecting () { console.log("Reconnecting");}
	onReconnectionError ( error ) { console.error("Reconnection error ", error); }

	connect() {
		console.log("asdasd");
		this.socket.connect();
	}

	reconnect() {
		socket.reconnect();
	}

	isConnected() {
		return !!this.socket && this.socket.isConnected();
	}
}