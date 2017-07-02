// @flow

import React, { Component } from 'react';
import { Recipe } from '../le-sec-test/recipe';
import { Unit } from '../units';
import { Observable } from '../observable';

import GraphVis from 'react-graph-vis';

const options = {
    width: '1500px',
    layout: {
        hierarchical: true,
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

type Node = {
    id: string,
    label: string,
};
type Edge = {
    from: string,
    to: string,
};
export class CalcGraph extends Component {
    
    props: {
        recipe: Recipe;
    }

    render() {
        const graph = this._getGraph(this.props.recipe);

        return <GraphVis graph={graph} options={options} events={events} />
    }

    _getGraph(recipe: Recipe): { nodes: Array<Node>, edges: Array<Edge> } {

        const nodes = {};
        const edges = [];

        const visitQueue: Array<Unit|Observable> = [].concat(this._getUnits(recipe));
        for (const unitOrObs of visitQueue) {
            nodes[unitOrObs.id] = nodes[unitOrObs.id] || this._toGraphvizNode(unitOrObs);

            if (!unitOrObs.deps) {
                continue;
            }

            const unit: Unit = (unitOrObs: any);
            for (const dep of unit.deps) {
                const visited = nodes[dep.id] !== undefined;
                if (!visited) {
                    visitQueue.push(dep);
                }

                edges.push({
                    from: dep.id,
                    to: unit.id,
                });
            }
        }

        return {
            nodes: Object.keys(nodes).map(function(key) {
                return nodes[key];
            }),
            edges: edges,
        };
    }

    _getUnits(recipe: Recipe): Array<Unit> {
        const units = [];
        for (const propName of Object.keys(recipe)) {
            const value = (recipe: any)[propName];
            if (value instanceof Unit) {
                value.setName(propName);
                units.push(value);
            }
        }

        return units;
    }

    _toGraphvizNode(unit: Observable): Node {
        let label = unit.name || unit.id;
        if (unit.value) {
            label += ': ' + unit.value().toFixed(2);
        }

        return {
            id: unit.id,
            label: label,
        };
    }
}
