import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch, Link} from "react-router-dom";
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";
 
import Logout from './Logout';
import ViewDoctorList from './ViewDoctorList';
import DoctorHeader from './DoctorHeader';

export default class AllDoctors extends Component {
    constructor(props) {
        super(props);
        this.state = {
            applications: []
        };
    }
    componentDidMount() {
        axios.get('https://peaceful-refuge-01419.herokuapp.com/LeoHelp/allDoctors')
            .then(response => { 
                this.setState({
                    applications: response.data
                });
            })
            .catch(function(error) {
                console.log(error);
            });
    }
    applicationList() { 
        return this.state.applications.map(function(currentApplication, i) {
            return <ViewDoctorList application={currentApplication} key={i} />;
        })
    }
    render() {
        return (
                <div className = 'container'>
                    <DoctorHeader />
                    <div>
                        <h3>Applications</h3>
                        <table className = 'table table-striped' style={{marginTop: 20}}>
                            <thead>
                                <tr>
                                    <th> Name </th>
                                    <th> Status </th>
                                    <th> View </th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.applicationList()}
                            </tbody>
                        </table>
                    </div>
                </div>
        )
    }
}
