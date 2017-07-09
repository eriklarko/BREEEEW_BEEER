import React, { Component } from 'react';
import { Recipe } from '../le-sec-test/recipe';
import { Unit } from '../units';
import { Observable } from '../observable';

import GraphVis from 'react-graph-vis';

const options = {
    width: '1500px',
    layout: {
        hierarchical: false,
    },
    edges: {
        color: "#000000"
    }
};

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
    state: {
        hilightedNodeIds: Array<string>;
        hilightedEdgeIds: Array<string>;
        network: any;
        searchString: string;
    }

    constructor() {
        super();
        this.state = {
            hilightedNodeIds: [],
            hilightedEdgeIds: [],
            network: null,
            searchString: '',
        };
    }

    render() {
        const graph = this._getGraph(this.props.recipe);
        const events = {
            select: this._selectNode.bind(this),
        }

        this._hilightNodes();

        return <div>
            <input type='text' value={this.state.searchString} onChange={(e) => {
                this.setState({
                    searchString: e.target.value,
                });
                this._searchForNode(e.target.value);
            }}/>
            <GraphVis graph={graph}
                options={options}
                events={events}
                getNetwork={
                    (network) => {
                        this.setState({
                            network: network,
                        });
                    }
                }/>
        </div>
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
        if (unit.value && typeof unit.value === 'function') {
            label += ': ' + unit.value().toFixed(2);
        }

        // http://visjs.org/docs/network/nodes.html#
        return {
            id: unit.id,
            label: label,
        };
    }

    _selectNode(event) {
        this.setState({
            hilightedNodeIds: event.nodes,
            hilightedEdgeIds: event.edges,
        });
    }

    _hilightNodes() {
        if(this.state.network) {

            const hilightedNodeIds = [].concat(this.state.hilightedNodeIds);
            for (const edgeId of this.state.hilightedEdgeIds) {
                const edge = this.state.network.body.edges[edgeId];
                hilightedNodeIds.push( edge.from.id );
                hilightedNodeIds.push( edge.to.id );

            }

            const hasHilightedNodes = hilightedNodeIds.length > 0;
            const defaultOptions = {
                color: hasHilightedNodes
                    ? 'rgba(210,229,255, 0.2)'
                    : 'rgba(210,229,255, 1)',
                
            };

            for(const node of Object.values(this.state.network.body.nodes)) {
                const isHilighted = hilightedNodeIds.includes(node.id);

                let options;
                if (isHilighted) {
                    options = {
                        color: 'rgba(210,229,255, 1)',
                    };
                } else {
                    options = defaultOptions;
                }
                node.setOptions(options);
            }

        }
    }

    _searchForNode(searchString) {
        if (searchString === '') {
            this.setState({
                hilightedNodeIds: [],
                hilightedEdgeIds: [],
            });

            return;
        }

        if(!this.state.network) {
            throw new Error("Cannot search yet, network not ready");
        }

        const nodeIds = [];
        for (const node of Object.values(this.state.network.body.nodes)) {
            const matchesSearchString = node.options.label.toLowerCase().indexOf(searchString.toLowerCase()) >= 0;
            if (matchesSearchString) {
                nodeIds.push(node.id);
            }
        }
        this.setState({
            hilightedNodeIds: nodeIds,
            hilightedEdgeIds: [],
        });
    }
}
