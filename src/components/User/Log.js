import React, {Component} from 'react';

/*
 * Class to showcase Log of user
 */
class Log extends Component {
    render() {
        return (
            <div>
                <p>{this.props.item.operation}</p>
                <p>{this.props.item.datetime}</p>
                <p>${this.props.item.text}</p>
            </div>
        );
    }
}

export default Log;