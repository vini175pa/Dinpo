import React from 'react';
import classNames from 'classnames';
export default class RequiredInput extends React.Component{

	input = null;

	state = {
		"error" : false
	};

	validate(){
		var value = this.input.value;

		if(value.trim() == ""){
			this.setState({
				"error": true
			});
			return false;
		}

		if(this.state.error)
			this.setState({error: false});

		return true

	}

  _onRootDOMNode(node) {
    this.input = node
  }

	render() {

		var className = classNames("dinpo-input", {
			'dinpo-input-error': this.state.error,
			"dinpo-input-lg": !!this.props.large
		}, this.props.className);

		return (
			<input ref={this._onRootDOMNode.bind(this)} {...this.props} className={className} />
		);
	}

	get value(){
		return this.input.value
	}

	set value(val) {
    this.input.value = val;
  }

  focus() {
    this.input.focus();
  }

  blur() {
    this.input.blur();
  }

}