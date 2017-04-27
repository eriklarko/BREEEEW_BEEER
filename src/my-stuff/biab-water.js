// @flow

import React, { Component } from 'react';
import {Brew} from "./brew";

/*
 * volume to warm = volume to boil + volume lost in the grain
 * volume lost in the grain = grain weight * 0.9 (http://www.humle.se/punbb/viewtopic.php?id=5083)
 * volume to boil = volume to bottle + trub loss + boil off + cooling loss
 */
export default class BiabWater extends Component {
    props: {
        brew: Brew,
    }

    _kgGrainsChanged = (e: Object) => {
        const kgGrains = e.target.value * 1;
        this.props.brew.setAmountOfGrainsToMash(kgGrains);

        this.forceUpdate();
    }

    _boilVolumeChanged = (e: Object) => {
        const toBoil = e.target.value * 1;
        this.props.brew.setAmountToBoil(toBoil);
        this.forceUpdate();
    }

    _fermenterVolumeChanged = (e: Object) => {
        const inFermenter = e.target.value * 1;

        this.props.brew.setDesiredLitersInFermenter(inFermenter);
        this.forceUpdate();
    }

    render() {
        const {brew} = this.props;
        return <div>
            <input
                type="text"
                value={brew.kgGrainsToMash}
                onChange={this._kgGrainsChanged} /> kg of grains
            <br/>

            Warm {brew.boilWater.toWarm} L
            <br/>

            Boil <input
                    type="text"
                    value={brew.boilWater.toBoil}
                    onChange={this._boilVolumeChanged} /> L
            <br/>

            Get <input
                    type="text"
                    value={brew.boilWater.inFermenter}
                    onChange={this._fermenterVolumeChanged} /> L in the fermenter
        </div>
    }
}
