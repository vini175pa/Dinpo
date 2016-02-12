import when from "when";
import request from "reqwest";
import LoginStore from "../stores/LoginStore";

export default {
	login(email, password) {
		return this.handleAuth(when(request({
			url: '/login'
		  , type: 'json'
		  , method: 'post'
		  , crossOrigin: true
		  , data: { email, password }
		})));
	},

	handleAuth(loginPromise) {
		return loginPromise
			.then((response) => {
				if(response.error || !response.user)
					throw new Error(response.error);

				return response
			});
	}
}