import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch, Link} from "react-router-dom";
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";

const SList = props => (
    <tr>
        <td>{props.data}</td>
    </tr>
)

export default class ShowECs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            EClist : []
        };
    }
    componentDidMount() {
        const data = {
            // user_name : localStorage.getItem('user_name'),
            // token : localStorage.getItem('token')
            user_name: this.props.user_name,
            token : this.props.token
        }
        console.log(data);
        axios.post('https://peaceful-refuge-01419.herokuapp.com/LeoHelp/user/emergency_contacts', data)
            .then(response => {
                this.setState({
                    EClist : response.data.filter((val) => val != "")
                });
            })
            .catch(function(error) {
                console.log(error);
            })
    }

    ECList() {
        return this.state.EClist.map(function(data, i) {
            return <SList data = {data} key={i} />;
        });
    }
    render() {
        return (
                <div className = "container">
                    <center><h2><b>EMERGENCY <span className="change-color">CONTACTS</span></b></h2>
                    <table className = 'table table-borderless table-hover' style={{marginTop: 20}}>                       
                        <tbody>
                            {this.ECList()}
                        </tbody>
                    </table>
                    </center>               
                </div>
        )
    }
}
