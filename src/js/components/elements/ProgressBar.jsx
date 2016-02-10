import React from 'react';
import classNames from 'classnames';
export default class ProgressBar extends React.Component{
	render() {

		var className = classNames("dinpo-progress-bar", {
			'dinpo-progress-bar-absolute': !!this.props.absolute,
			'dinpo-dn': this.props.hidden
		}, this.props.className);

		return (
			<div {...this.props} className={className}>
		        <div className="dinpo-bar dinpo-bar-1"></div>
		        <div className="dinpo-bar dinpo-bar-2"></div>
		        <div className="dinpo-bar dinpo-bar-3"></div>
		        <div className="dinpo-bar dinpo-bar-4"></div>
		    </div>
		);
	}
}