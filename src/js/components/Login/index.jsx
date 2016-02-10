import RequiredInput from "../elements/RequiredInput";
import React from 'react';
import classNames from 'classnames';
import ProgressBar from '../elements/ProgressBar';
import ServerActions from '../../actions/ServerActions';
export default class Login extends React.Component{

	state = {
		loading: false,
		error: false
	};

	handleSubmit(event){
		event.preventDefault();

		var { emailInput, passwordInput } = this.refs;


		if(!emailInput.validate() | !passwordInput.validate())
			return


		var email = emailInput.value,
			password = passwordInput.value;

		var self = this;

		ServerActions
			.login(email, password)
				.catch(function(err){
					self.setState({
						error: true,
						loading: false
					});
				});

		this.setState({
			loading: true
		});
	}

	handleClickOnError() {
		this.setState({
			error: false
		});
	}

	render() {

		var self = this;

		var loginContentClass = classNames({
			'disabled': this.state.loading
		});

		var errorClass = classNames({
			'active': this.state.error
		});

		return (
			<div id="dinpo">
			    <ProgressBar absolute hidden={!this.state.loading}/>
			    <div id="dinpo-login">
			        <div id="dinpo-login-content" className={loginContentClass}>
			            <a href=""><span className="dinpo-icon dinpo-icon-chat-logo"></span></a>
			            <p className="dinpo-p-large">Insira seu <b>endereço de email</b> e sua <b>senha</b> </p>
			            <form action="" onSubmit={this.handleSubmit.bind(this)}>
				            <RequiredInput ref="emailInput" type="text" placeholder="you@domain.com" className="dinpo-fill-width dinpo-margin-top" spellCheck="false" large/>
				            <RequiredInput ref="passwordInput" type="password" placeholder="ex., ••••••••••••" className="dinpo-fill-width dinpo-margin-top" spellCheck="false" large/>
				            <button type="submit" className="dinpo-button dinpo-button-lg dinpo-button-primary dinpo-margin-top dinpo-fill-width">Fazer login</button>
			            </form>
			            <span id="dinpo-login-error" onClick={this.handleClickOnError.bind(this)} className={errorClass}>Email ou senha incorreta</span>
			        </div>
			        <footer id="dinpo-footer">
			            <a href="">GitHub</a>
			            <a href="">Sobre</a>
			            <span>Open source</span>
			            <div id="dinpo-author">
			                <span>Created by <a href="https://github.com/vini175pa">@vin175pa </a></span>
			                <a href="https://github.com/vini175pa">
			                    <div className="dinpo-user-image dinpo-user-image-min" style={{"backgroundImage":"url(https://avatars.githubusercontent.com/u/9030018?v=3&s=40)"}}></div>
			                </a>
			            </div>
			        </footer>
			    </div>
			</div>
		);
	}
}