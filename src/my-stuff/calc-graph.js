// @flow

import React, { Component } from 'react';
import {Sigma, RandomizeNodePositions, RelativeSize} from 'react-sigma';

export default class CalcGraph extends Component {
    
    render() {
        const root : BrewValue  = this.props.root;
        const graph = this._getGraphData(root);

        console.log(graph);
        return <Sigma graph={{nodes:[{id:"n1", label:"Alice"}, {id:"n2", label:"Rabbit"}], edges:[{id:"e1",source:"n1",target:"n2",label:"SEES"}]}} settings={{drawEdges:true}}>
                <RelativeSize initialSize={15}/>
                    <RandomizeNodePositions/>
                </Sigma>
        return <Sigma graph={graph}>
           <RelativeSize initialSize={15} />
           <RandomizeNodePositions />
        </Sigma>
    }

    _getGraphData(node) {
        const nodes = {}
        const edges = [];

        nodes[node.id] = this._asSigmaNode(node);

        for (const input of node.inputs) {
            nodes[input.id] = nodes[input.id] || this._asSigmaNode(input);

            edges.push({
                id: input.id + " -> " + node.id,
                source: input.id,
                target: node.id,
            });
        }
        return {
            nodes: Object.values(nodes),
            edges: edges
        };
    }

    _asSigmaNode(brewValue: BrewValue) {
        return {
            id: brewValue.id,
            label: brewValue.id + ' hej',
        };
    }
}

