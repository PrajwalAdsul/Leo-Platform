import React, {Component} from 'react';

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