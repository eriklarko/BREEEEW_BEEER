// @flow

import React, { Component } from 'react';

/*
 * volume to warm = volume to boil + volume lost in the grain
 * volume lost in the grain = grain weight * 0.9 (http://www.humle.se/punbb/viewtopic.php?id=5083)
 * volume to boil = volume to bottle + trub loss + boil off + cooling loss
 */
export default class BiabWater extends Component {
    state: {
        kgGrains: number,
        toWarm: number,
        toBoil: number,
        inFermenter: number,
        maxVolume: number,
    }

    constructor() {
        super();
        this.state = {
            kgGrains: 2,
            toWarm: 0,
            toBoil: 0,
            inFermenter: 5,
            maxVolume: 0,
        }
    }

    _kgGrainsChanged = (e: Object) => {
        const kgGrains = e.target.value * 1;
        const toWarm = this.state.toBoil + kgGrains * 0.9;

        this.setState({
            kgGrains: kgGrains,
            toWarm: toWarm,
        });
    }

    _boilVolumeChanged = (e: Object) => {
        const toBoil = e.target.value * 1;
        const toWarm = toBoil + this.state.kgGrains * 0.9;

        const boilOff = 1;
        const trub = 0.5;
        const inFermenter = toBoil - boilOff - trub;

        this.setState({
            toWarm,
            toBoil,
            inFermenter,
        });
    }

    _fermenterVolumeChanged = (e: Object) => {
        const inFermenter = e.target.value * 1;

        const boilOff = 1;
        const trub = 0.5;
        const toBoil = inFermenter + boilOff + trub;

        const toWarm = toBoil + this.state.kgGrains * 0.9;

        this.setState({
            toBoil,
            toWarm,
            inFermenter,
        });
    }

    render() {
        return <div>
            <input
                type="text"
                value={this.state.kgGrains}
                onChange={this._kgGrainsChanged} /> kg of grains
            <br/>

            Warm {this.state.toWarm} L
            <br/>

            Boil <input
                    type="text"
                    value={this.state.toBoil}
                    onChange={this._boilVolumeChanged} /> L
            <br/>

            Get <input
                    type="text"
                    value={this.state.inFermenter}
                    onChange={this._fermenterVolumeChanged} /> L in the fermenter
        </div>
    }
}
