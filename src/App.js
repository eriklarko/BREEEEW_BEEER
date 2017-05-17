// @flow

import React, { Component } from 'react';

import BrewDetails from "./my-stuff/brew-details";
import {Brew} from "./my-stuff/brew";
import CalcGraph from "./my-stuff/calc-graph";
import { Liters, SpecificGravity } from "./my-stuff/units";
import { Recipe } from "./my-stuff/recipe";

const brew = new Brew();

class AppState {
    currentRecipe: Recipe;
}

class App extends Component {



    render() {
        const appState: AppState = new AppState();
        appState.currentRecipe = new Recipe();

        /*const leaf1 = new BrewValue(1);
        const leaf2 = new BrewValue(1);

        const root = new BrewValue(0, ()=>{}, leaf1, leaf2);

        return <CalcGraph root={root} />*/
        return <BrewDetails brew={brew} onSave={(a) => console.log(a)}/>
    }
}

export default App;
