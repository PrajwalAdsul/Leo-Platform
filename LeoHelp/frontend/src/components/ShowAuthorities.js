import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch, Link} from "react-router-dom";
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";
import DROHeader from './DROHeader';
 
const SList = props => (
    <tr>
        <td>{props.data.name}</td>
        <td>{props.data.phone_no}</td>
        <td>{props.data.area}</td>
        <td>{props.data.latitude}</td>
        <td>{props.data.longitude}</td>
    </tr>
)

export default class StartupList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            DROslist : []
        };
    }
    componentDidMount() {
        axios.get('http://localhost:4001/LeoHelp/allDROs')
            .then(response => {
                this.setState({
                    DROslist : response.data
                });
            })
            .catch(function(error) {
                console.log(error);
            })
    }

    DROsList() {
        return this.state.DROslist.map(function(data, i) {
            return <SList data = {data} key={i} />;
        })
    }
    render() {
        if(localStorage.getItem('DRO_start') !== "start"){
            return <Redirect push to = "/DROSignIn" />;
        }
        return (
            <div>
                <DROHeader />
               
                <div className = 'container list'>
                    
                        <h2>ALL <span className="change-color">AUTHORITIES</span></h2>
                        <table className = 'table table-striped' style={{marginTop: 20}}>
                            <thead>
                                <tr>
                                    <th><h4><b>NAME</b></h4></th>
                                    <th><h4><b>MOBILE NO</b></h4></th>
                                    <th><h4><b>AREA</b></h4></th>
                                    <th><h4><b>LATITUDE</b></h4></th>
                                    <th><h4><b>LONGITUDE</b></h4></th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.DROsList()}
                            </tbody>
                        </table>
                    
                </div>
            </div>
        )
    }
}
