// @flow

import React, { Component } from 'react';
import { CalcGraph } from './my-stuff/components/CalcGraph';

import { Recipe, LeSec } from './my-stuff/le-sec-test/recipe';
import { Main } from './my-stuff/main.js';

class App extends Component {

    render() {
        const leSec = new Recipe(LeSec);
        const routes = new Map();
        routes.set('/', <Main a={1}/>);
        routes.set('/graph', <CalcGraph recipe={ leSec } />);

        return <Router routes={ routes } />
    }
}

class Router extends Component {

    state: {
        path: string,
    };
    props: {
        routes: Map<string, React$Element<any>>,
        defaultRoute?: React$Element<any>,
    };

    constructor() {
        super();
        this.state = {
            path: window.location.pathname,
        };
    }

    componentDidMount() {
        window.onpopstate = (e) => {
            console.log('ON POP STATE', e);
        };
    }

    componentWillUnmount() {
        window.onpopstate = undefined;
    }


    render() {
        console.log('rendering', this.state.path);
        const component = this.props.routes.get(this.state.path) || this.props.defaultRoute || <div>No route :( {this.state.path} </div>

        return component;
    }
}

export default App;
