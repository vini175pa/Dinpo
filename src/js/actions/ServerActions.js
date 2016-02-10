import when from "when";
import request from "reqwest";
import LoginStore from "../stores/LoginStore";

export default {
	login(email, password) {
		return when.promise(function(resolve, reject){
			reject(true);
		});
	}
}