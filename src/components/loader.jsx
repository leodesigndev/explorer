import { Rings } from 'react-loader-spinner';
import React, { Component } from "react";

class Loading extends Component {
  
  render() {

    return (
      <Rings color="#00BFFF" height={80} width={80} />
    );
    
  }
}

export default Loading;

