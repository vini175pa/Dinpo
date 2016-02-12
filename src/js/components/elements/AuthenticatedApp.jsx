import React from 'react';
import LoginStore from "../../stores/LoginStore";
import { Route, RouteHandler, Link } from 'react-router';
import AuthService from "../../services/AuthService";

export default class AuthenticatedApp extends React.Component {
  render(){
    console.log(this.props.children);
    return (

        <div>{this.props.children}</div>
      )
  }
}
