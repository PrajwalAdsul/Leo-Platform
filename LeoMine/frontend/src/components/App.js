import React, { Component } from "react";
import { BrowserRouter as Router, Route, Redirect, Switch, Link } from "react-router-dom";

import AddCrime from './AddCrime';
import AddArea from './AddArea';
import ShowCrimes from './ShowCrimes';
import ShowAreas from './ShowAreas';
import WebScrap from './WebScrap';

/*
//import SignIn from './SignIn'
import Registration from './Registration';
import StartupList from './StartupList';
import ApplicationList from './ApplicationList';
*/
class App extends Component {
	render() {
		return (
			<div>
			<center><h1>Leo Mine</h1></center>
			<Router>
					<div className="App">
					<Switch>
						<Route exact path="/AddCrime" component={AddCrime} />
						<Route exact path="/AddArea" component={AddArea} />
						<Route exact path="/ShowCrimes" component={ShowCrimes}/>
						<Route exact path="/ShowAreas" component={ShowAreas}/>
						<Route exact path = "/WebScrap" component={WebScrap}/>
						<Redirect from="/" to="AddArea" />
					</Switch>
					</div>
				</Router>		
			</div>
		);
	}
}
export default App;

