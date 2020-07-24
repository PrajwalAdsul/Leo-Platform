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
import DoctorSignIn from './DoctorSignIn';
import DoctorSignUp from './DoctorSignUp';
import LoggedIn from './LoggedIn';
import DROSignUp from './DROSignUp';
import DROSignIn from './DROSignIn';
import DoctorStatus from './DoctorStatus';
import DoctorMainPage from './DoctorMainPage';
import AdminDoctor from './AdminDoctor';
import AllDoctors from './AllDoctors';
import DoctorProfile from './DoctorProfile';
import DoctorSignInAdmin from './DoctorSignInAdmin';
import UploadDoc from './UploadDoc';
import NameDoc from './NameDoc';
import Searchh from './Search';
import LeoDropBox from './LeoDropBox';
import Download from './Download';
import UserProfile from './UserProfile';
import UserNews from './UserNews';
import DRONews from './DRONews';
import HomePage from './HomePage';
class App extends Component {
	render() {

		return (
			<div>
				<Router>
					<div className="App">
						<Switch>
							<Route exact path="/UploadDoc" component={UploadDoc} />
							<Route exact path="/DROPanel" component={DROPanel} />
							<Route exact path="/LoggedIn" component={LoggedIn} />
							<Route exact path="/ShowECs" component={ShowECs} />
							<Route exact path="/SimpleMap" component={SimpleMap} />
							<Route exact path="/ShowTroubles" component={DROPanel} />
							<Route exact path="/InTrouble" component={InTrouble} />
							<Route exact path="/ShowAuthorities" component={ShowAuthorities} />
							<Route exact path="/UserSignIn" component={UserSignIn} />
							<Route exact path="/UserSignUp" component={UserSignUp} />
							<Route exact path="/DROSignIn" component={DROSignIn} />
							<Route exact path="/DROSignUp" component={DROSignUp} />
							<Route exact path="/DoctorSignIn" component={DoctorSignIn} />
							<Route exact path="/DoctorSignUp" component={DoctorSignUp} />
							<Route exact path="/DoctorStatus" component={DoctorStatus} />
							<Route exact path="/DoctorMainPage" component={DoctorMainPage} />
							<Route exact path="/AdminDoctor" component={AdminDoctor} />
							<Route exact path="/AllDoctors" component={AllDoctors} />
							<Route exact path="/DoctorProfile" component={DoctorProfile} />
							<Route exact path="/DoctorSignInAdmin" component={DoctorSignInAdmin} />
							<Route exact path="/NameDoc" component={NameDoc} />
							<Route exact path="/Search" component={Searchh} />
							<Route exact path="/LeoDropBox" component={LeoDropBox} />
							<Route exact path="/Download" component={Download} />
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
