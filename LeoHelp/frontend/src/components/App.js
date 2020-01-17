import React, { Component } from "react";
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import ShowTroubles from './ShowTroubles';
import DROPanel from './DROPanel';
import SimpleMap from './SimpleMap';
import InTrouble from './InTrouble';
import ShowECs from './ShowECs';
import ShowAuthorities from './ShowAuthorities';
import UserSignIn from './UserSignIn';
import UserSignUp from './UserSignUp';
import LoggedIn from './LoggedIn';
import DROSignUp from './DROSignUp';
import DROSignIn from './DROSignIn';
					

class App extends Component {
	render() {
	
		return (
<<<<<<< HEAD
			<div>
				<Router>
					<div className="App">
					<Switch>
						<Route exact path="/DROPanel" component={DROPanel} />
						<Route exact path="/LoggedIn" component={LoggedIn} />
						<Route exact path="/ShowECs" component={ShowECs} />
						<Route exact path="/SimpleMap" component={SimpleMap} />	
						<Route exact path = "/ShowTroubles" component={DROPanel} />
						<Route exact path = "/InTrouble" component = {InTrouble} />
						<Route exact path = "/ShowAuthorities" component = {ShowAuthorities} />
						<Route exact path="/UserSignIn" component={UserSignIn} />
						<Route exact path="/UserSignUp" component={UserSignUp} />
						<Route exact path="/DROSignIn" component={DROSignIn} />
						<Route exact path="/DROSignUp" component={DROSignUp} />							
						<Redirect from="/" to="/UserSignIn" />
					</Switch>
					</div>
				</Router>
				<link
				  rel="stylesheet"
				  href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
				  crossOrigin="anonymous"
				/>
=======
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
>>>>>>> 0d3bc11edee130e8eb945afebc05e4c0dbccc86a
			</div>
			
		);
	}
}
export default App;
