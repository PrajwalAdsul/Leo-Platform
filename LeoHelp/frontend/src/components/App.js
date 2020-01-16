import React, { Component } from "react";
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";

//import AddCrime from './AddCrime';
//import ShowCrimes from './ShowCrimes';
import ShowTroubles from './ShowTroubles';
import DROPanel from './DROPanel';
import SimpleMap from './SimpleMap';
import InTrouble from './InTrouble';
import ShowAuthorities from './ShowAuthorities';
import UserSignIn from './UserSignIn';
import UserSignUp from './UserSignUp';
import LoggedIn from './LoggedIn';
import DROSignUp from './DROSignUp';
import DROSignIn from './DROSignIn';

//import GoogleMap from './GoogleMap';
/*
//import SignIn from './SignIn'
import Registration from './Registration';
import StartupList from './StartupList';
import ApplicationList from './ApplicationList';
*/

//<Route exact path = "/SimpleMap" componenet = {SimpleMap} />
					

class App extends Component {
	render() {
		/*
		return (
			<GoogleMap />
		);*/
		
		return (
			<div><center><h1>Leo Help</h1></center>
			<Router>
				<div className="App">
				<Switch>
					<Route exact path="/DROPanel" component={DROPanel} />
					<Route exact path="/LoggedIn" component={LoggedIn} />
					
					<Route exact path = "/InTrouble" component = {InTrouble} />
					<Route exact path = "/ShowAuthorities" component = {ShowAuthorities} />
					<Route exact path="/UserSignIn" component={UserSignIn} />
					<Route exact path="/UserSignUp" component={UserSignUp} />
					<Route exact path="/DROSignIn" component={DROSignIn} />
					<Route exact path="/DROSignUp" component={DROSignUp} />
						
					<Redirect from="/" to="UserSignIn" />
				</Switch>
				</div>
			</Router>
			</div>
		);
	}
}
export default App;
