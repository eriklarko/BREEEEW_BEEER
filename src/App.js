// @flow

import React, { Component } from 'react';
import { CalcGraph } from './my-stuff/components/CalcGraph';

import { Recipe, LeSec } from './my-stuff/le-sec-test/recipe';

class App extends Component {

    render() {
        const leSec = new Recipe(LeSec);
        return <div id='apa'>
            <CalcGraph recipe={ leSec } />
        </div>
    }
}

export default App;
