import RouterContainer from "../services/RouterContainer";
import AuthService from "../services/AuthService";
export default {

	login: function(email, password){
		var self = this;
		return AuthService.login(email, password)
			.then((token) => {
				self.loginByToken(token);
			});
	},

	loginByToken: function(token){
		var savedToken = localStorage.getItem("auth_token",  token);

		if ( savedToken !== token ) {
			var nextPath = RouterContainer.get().getCurrentQuery().nextPath || '/';

			RouterContainer.get().transitionTo(nextPath);
			localStorage.setItem('auth_token', token);
		}

	}
}