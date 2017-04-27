// @flow

import React, { Component } from 'react';

import BrewDetails from "./my-stuff/brew-details";
import {Brew} from "./my-stuff/brew";
import { BrewValue } from "./my-stuff/brew-value";
import CalcGraph from "./my-stuff/calc-graph";

const brew = new Brew();
class App extends Component {
    render() {
        const leaf1 = new BrewValue();
        const leaf2 = new BrewValue();

        const root = new BrewValue(leaf1, leaf2);

        return <CalcGraph root={root} />
        //return <BrewDetails brew={brew} onSave={(a) => console.log(a)}/>
    }
}

export default App;
