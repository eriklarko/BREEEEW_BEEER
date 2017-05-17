// @flow

// Uses https://github.com/crubier/react-graph-vis

import React, { Component } from 'react';
import { ReactiveObservable } from './observable';
import GraphVis from 'react-graph-vis';

export default class CalcGraph extends Component {
    
    render() {
        const root : ReactiveObservable  = this.props.root;
        const graph = this._getGraphData(root);

        const options = {
            layout: {
                hierarchical: true
            },
            edges: {
                color: "#000000"
            }
        };
        const events = {
            select: function(event) {
                console.log('Selected node', event);
            }
        }
         
        return <GraphVis graph={graph} options={options} events={events} />
    }

    _getGraphData(node) {
        const nodes = {}
        const edges = [];

        nodes[node.id] = this._asGraphVisNode(node);

        for (const input of node.inputs) {
            nodes[input.id] = nodes[input.id] || this._asGraphVisNode(input);

            edges.push({
                from: input.id,
                to: node.id,
            });
        }
        return {
            nodes: Object.keys(nodes).map(function(key) {
                    return nodes[key];
            }),
            edges: edges
        };
    }

    _asGraphVisNode(brewValue: ReactiveObservable) {
        return {
            id: brewValue.id,
            label: brewValue.id + ' hej',
            color: '#09cdda',
        };
    }
}

