import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch, Link} from "react-router-dom";
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";
import UnMarkTrouble from './UnMarkTrouble';

const SList = props => (
    <tr>
        <td>{props.data.user_name}</td>
        <td>{props.data.area}</td>
        <td>
            <a className='nav-item nav-link' href = {"https://www.google.com/maps?q=" + props.data.area} target="_blank">Location</a>
        </td>
        <td>
            <Link  
             to={{
              pathname: '/UserProfile',
              state: {
                user_name : props.data.user_name
              }}}
             className='nav-item nav-link'>View Profile</Link>
        </td>
        <td>
            <UnMarkTrouble user_name = {props.data.user_name} latitude = {props.data.latitude} longitude = {props.data.longitude}/>
        </td>
    </tr>
)

export default class ShowTroubles extends Component {
    constructor(props) {
        super(props);
        this.state = {
            troubleslist : []
        };
    }
    componentDidMount() {
        axios.get('https://peaceful-refuge-01419.herokuapp.com/LeoHelp/allUsers')
            .then(response => {
                this.setState({
                    troubleslist : response.data
                });
            console.log(this.state.troubleslist);
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
                console.log(error);
            })
    }

    troublesListf() {
        return this.state.troubleslist.filter(troubleslist => troubleslist.inTrouble === true).map(
            function(data, i) {
                return <SList data = {data} key={i} />;
            }
        )
    }
    render() {
        if(localStorage.getItem('DRO_start') !== "start" && localStorage.getItem('session') !== "start"){
            return <Redirect push to = "/DROSignIn" />;
        }
        return (
            <div>
               <div className = 'container list'>  
                        <h2>USERS IN <span className="change-color">TROUBLE</span></h2>
                        <table className = 'table table-striped table-hover' style={{marginTop: 20}}>
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
                                {this.troublesListf()}
                            </tbody>
                        </table>
                </div>
            </div>
        )
    }
}

//https://www.google.com/maps?q=Pune