import reqwest from "reqwest";
import when from "when";
export default {

	login(email, password) {
		return this.handleLogin(
			when(
				reqwest({
					url: '/login'
			  , type: 'json'
			  , method: 'post'
			  , crossOrigin: true
			  , data: {
			  		email, password
			  	}
				})));
	},

	loginByToken(token) {
		return this.handleLogin(
			when(
				reqwest({
					url: '/auth/token'
			  , type: 'json'
			  , method: 'post'
			  , crossOrigin: true
			  , data: {
			  	token
			  }
			})));
	},

	handleLogin(loginPromisse){
		return loginPromisse
			.then(( response ) => {

				var { error, user } = response;

				if( error )
					throw new Error(response.error)

				if( !user )
					throw new Error("User is null")

				if( !user.token )
					throw new Error("Token is null")

				console.log(user);

				return user


			});
	}



}