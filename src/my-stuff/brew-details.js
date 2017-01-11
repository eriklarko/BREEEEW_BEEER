// @flow
import React, {Component} from "react";
import BiabWater from "./biab-water";
import GravityAdjustments from "./gravity-adjustments";

type Brew = {
    name: string,
    brewDate: Date,
    og: number,
 };

export default class BrewDetails extends Component {
    props: {
        brew: Brew,
        onSave: (brew: Brew) => void,
    };

    render() {
        const { brew } = this.props;
        return (
            <div>
                <h1>{brew.name}</h1>
                <div>{brew.brewDate.toString()}</div>

                <br/>
                <br/>
                <BiabWater />

                <br/>
                <br/>
                <GravityAdjustments brew={brew} />

                <br/>
                <br/>
                <button onClick={() => this.props.onSave(brew)}>Save</button>
            </div>
        )
    }
}
