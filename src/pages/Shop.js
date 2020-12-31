import React, {useState, Component} from "react";
import axios from 'axios';

export default class Shop extends Component {
    constructor() {
        super();
        this.state = {
            username: "Not yet gotten"
        };
    }
    handleButtonClick = () => {
        axios.get("/users").then(response => {
            this.setState({
                username: response.data[0].username
            });
        });
    };

    render() {
        return(
            <div > 
                <h1>Shop page</h1>
                <button onClick={this.handleButtonClick}> Get username </button>
                <h3> My username is : {this.state.username} </h3>
            </div>
        );
    }

}