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
        console.log("****");
        console.log(this.props.user_name);
        console.log("****");
        
        const data = {
            user_name : this.props.user_name
        }
        console.log(data);
        axios.post('http://localhost:4001/LeoHelp/getECs', data)
            .then(response => {
                this.setState({
                    EClist : response.data
                });
                console.log("****");
                console.log("0000");
                console.log("****");
                

            })
            .catch(function(error) {
                console.log(error);
            })
            console.log(this.state.EClist);
    }

    ECList() {
        return this.state.EClist.map(function(data, i) {
            return <SList data = {data} key={i} />;
        });
    }
    render() {
        return (
                <div className = 'user-jumbotron'>
                    <div className="container">
                    <center><h3><b>EMERGENCY <span className="change-color">CONTACTS</span></b></h3></center>
                
                    <div>
                        <table className = 'table table-striped' style={{marginTop: 20}}>
                           
                            <tbody>
                                {this.ECList()}
                            </tbody>
                        </table>
                    </div>
                    </div>
                    
                </div>
        )
    }
}
