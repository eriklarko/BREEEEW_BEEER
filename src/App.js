// @flow

import React, { Component } from 'react';

import BrewDetails from "./my-stuff/brew-details";
import {Brew} from "./my-stuff/brew";
import { BrewValue } from "./my-stuff/brew-value";
import CalcGraph from "./my-stuff/calc-graph";
import { Liters, SpecificGravity } from "./my-stuff/units";
import { tinseth } from "./my-stuff/brew-values/bitterness/tinseth";
import { Recipe } from "./my-stuff/recipe";

const brew = new Brew();

class AppState {
    currentRecipe: Recipe;
}

class App extends Component {



    render() {
        const appState: AppState = new AppState();
        appState.currentRecipe = new Recipe();

        const leaf1 = new BrewValue();
        const leaf2 = new BrewValue();

        const root = new BrewValue('', 0, leaf1, leaf2);
        const a = tinseth([], new Liters(1), new SpecificGravity(1));
        console.log(a);

        return <CalcGraph root={root} />
        //return <BrewDetails brew={brew} onSave={(a) => console.log(a)}/>
    }
}

export default App;
