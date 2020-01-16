import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch, Link} from "react-router-dom";
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";

const SList = props => (
    <tr>
        <td>{props.data.name}</td>
        <td>{props.data.phone}</td>
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
        return (
                <div className = 'container'>
                    <nav className='navbar navbar-expand-lg navbar-light bg-light'>
                    </nav>
                    <div>
                        <h3>List</h3>
                        <table className = 'table table-striped' style={{marginTop: 20}}>
                            <thead>
                                <tr>
                                    <th> Name </th>
                                    <th> Phone </th>
                                    <th> Area </th>
                                    <th> latitude </th>
                                    <th> longitude </th>
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
