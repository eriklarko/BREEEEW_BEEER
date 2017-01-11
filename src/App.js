// @flow

import React, { Component } from 'react';

import BrewDetails from "./my-stuff/brew-details"

class App extends Component {
  render() {
    return (
        <BrewDetails brew={{
                name: "yo",
                brewDate: new Date(),
                og: 1.054
            }} onSave={(a) => console.log(a)}/>
    );
  }
}

export default App;
