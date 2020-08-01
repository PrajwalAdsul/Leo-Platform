import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch, Link} from "react-router-dom";
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";
import {Tabs, Tab} from 'react-bootstrap-tabs';
import UnMarkTrouble from './UnMarkTrouble';

/*
 * Class to showcase user marked in trouble
 */
const SList = props => (
    <tr>
        <td>{props.data.user_name}</td>
        <td>{props.data.area}</td>
        <td>
            <a className='table-link' href = {"https://www.google.com/maps?q=" + props.data.area} target="_blank">Location</a>
        </td>
        <td>
            <Link  
             to={{
              pathname: '/UserProfile',
              state: {
                user_name : props.data.user_name,
                token : props.token
              }}}
             className='table-link'>View Profile</Link>
        </td>
        <td>
            <UnMarkTrouble user_name = {props.data.user_name} latitude = {props.data.latitude} longitude = {props.data.longitude}
            token = {props.data.token}/>
        </td>
    </tr>
)

export default class ShowTroubles extends Component {
    constructor(props) {
        super(props);
        this.state = {
            troubleslist : [],
            user_name : null,
            password : null,
            token : null
        };
    }
    sha256 = async message => {
        // encode as UTF-8
        const msgBuffer = new TextEncoder('utf-8').encode(message);                    

        // hash the message
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);

        // convert ArrayBuffer to Array
        const hashArray = Array.from(new Uint8Array(hashBuffer));

        // convert bytes to hex string                  
        const hashHex = hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('');
        return hashHex; 
    }

    componentDidMount() {
        this.setState({
            user_name : localStorage.getItem('user_name'),
            password : localStorage.getItem('password'),
            token : localStorage.getItem('token')    
        });

        // immediate state change is not froced hence reading data from localStorage
        let data = {
            user_name : localStorage.getItem('user_name'),
            password : localStorage.getItem('password'),
            token : localStorage.getItem('token')
        };
        
        axios.post('https://peaceful-refuge-01419.herokuapp.com/LeoHelp/dro/all_users', data)
            .then(response => {
                this.setState({
                    troubleslist : response.data,
                });
        
            // sort users on basis of time and date, and show recent users at the top
            let a = this.state.troubleslist.sort(function(a, b) {
              var keyA = new Date(a.datetime),
                keyB = new Date(b.datetime);
              // Compare the 2 dates
              if (keyA < keyB) return -1;
              if (keyA > keyB) return 1;
              return 0;
            });
            this.setState({
                troubleslist : a
            });
            })
            .catch(function(error) {
                // log the error at user side
                console.log(error);
            })
    }

    troublesListPlatform() {
        let token = this.state.token;
        return this.state.troubleslist.filter(troubleslist => troubleslist.inTrouble === true && 
            (troubleslist.type == "app" || troubleslist.type == "web")).map(
            function(data, i) {
                return <SList data = {data} token = {token} key={i} />;
            }
        )
    }

    troublesListBot() {
        let token = this.state.token;
        return this.state.troubleslist.filter(troubleslist => troubleslist.inTrouble === true && 
            (troubleslist.type == "bot")).map(
            function(data, i) {
                return <SList data = {data} token = {token} key={i} />;
            }
        )
    }

    render() {
        if(localStorage.getItem('DRO_start') !== "start" || localStorage.getItem('session') !== "start" || localStorage.getItem('token') == null){
            return <Redirect push to = "/DROSignIn" />;
        }
        return (
            <div className="container">
              <Tabs onSelect={(index, label) => console.log(label + ' selected')}>
                    <Tab label="Platform">           
                       <div className = 'container list'>  
                            <h2>USERS IN <span className="change-color">TROUBLE</span></h2>
                            <div className="table-responsive">
                                <table className = 'table table-hover' style={{marginTop: 20}}>
                                    <thead>
                                        <tr>
                                            <th>USERNAME</th>
                                            <th>AREA</th>
                                            <th>MAP</th>
                                            <th>PROFILE</th>
                                            <th>UNMARK</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.troublesListPlatform()}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </Tab>
                    <Tab label="Bot">
                        <div className = 'container list'>  
                            <h2>USERS IN <span className="change-color">TROUBLE</span></h2>
                            <div className="table-responsive">
                                <table className = 'table table-hover' style={{marginTop: 20}}>
                                    <thead>
                                        <tr>
                                            <th>USERNAME</th>
                                            <th>AREA</th>
                                            <th>MAP</th>
                                            <th>PROFILE</th>
                                            <th>UNMARK</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.troublesListBot()}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </Tab>
                </Tabs>
            </div>
        )
    }
}
