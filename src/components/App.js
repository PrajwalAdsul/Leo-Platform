import React, { Component } from "react";
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";

import DROPanel from './DRO/DROPanel';
import DROSignUp from './DRO/DROSignUp';
import DROSignIn from './DRO/DROSignIn';
import UserProfile from './DRO/UserProfile';
import ShowTroubles from './DRO/ShowTroubles';

import UserSignIn from './User/UserSignIn';
import UserSignUp from './User/UserSignUp';
import LoggedIn from './User/LoggedIn';
import ShowECs from './User/ShowECs';

import UserNews from './News/UserNews';
import DRONews from './News/DRONews';
import HomePage from './Styling/HomePage';

class App extends Component {
	render() {

		return (
			<div>
				<Router>
					<div className="App">
						<Switch>
							<Route exact path="/DROPanel" component={DROPanel} />
							<Route exact path="/LoggedIn" component={LoggedIn} />
							<Route exact path="/ShowECs" component={ShowECs} />
							<Route exact path="/ShowTroubles" component={DROPanel} />
							<Route exact path="/UserSignIn" component={UserSignIn} />
							<Route exact path="/UserSignUp" component={UserSignUp} />
							<Route exact path="/DROSignIn" component={DROSignIn} />
							<Route exact path="/DROSignUp" component={DROSignUp} />
							<Route exact path="/UserProfile" component={UserProfile} />
							<Route exact path="/UserNews" component={UserNews} />
							<Route exact path="/DRONews" component={DRONews} />
							<Route exact path="/HomePage" component={HomePage} />
							<Redirect from="/" to="/HomePage" />
						</Switch>
					</div>
				</Router>
				<link
					rel="stylesheet"
					href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
					crossOrigin="anonymous"
				/>
			</div>
		);
	}
}
export default App;
