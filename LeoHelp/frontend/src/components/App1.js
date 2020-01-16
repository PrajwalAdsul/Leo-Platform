import React, { Component } from "react";
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

//import AddCrime from './AddCrime';
//import ShowCrimes from './ShowCrimes';

import UserSignIn from './UserSignIn';
import UserSignUp from './UserSignUp';


/*
//import SignIn from './SignIn'
import Registration from './Registration';
import StartupList from './StartupList';
import ApplicationList from './ApplicationList';
*/
class App extends Component {
	render() {
		return (
		
			<Router>
					<div className="App">
					<Switch>
						<Route exact path="/UserSignIn" component={UserSignIn} />
						<Route exact path="/UserSignUp" component={UserSignUp} />
						<Redirect from="/" to="UserSignIn" />
					</Switch>
					</div>
				</Router>
		);
	}
}
export default App;
