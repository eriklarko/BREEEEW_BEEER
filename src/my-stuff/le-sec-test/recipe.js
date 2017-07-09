// @flow

import { ObservableArray } from '../observable';
import { HopAddition, Hop } from "../brew-values/hops";
import { MaltAddition, Malt } from "../brew-values/malt";
import { Yeast } from "../brew-values/yeast";
import { Unit, Minutes, Grams, Percent, Liters, SpecificGravity, IBU, Kilos, ABV, Factor, ExtractPotential, GravityPoints, Celsius } from '../units';
import { tinseth } from "../brew-values/bitterness/tinseth";
import { biabWater } from "../brew-values/biab-water";
import { adjustForBoilOff } from "../brew-values/water";
import { daniels } from "../brew-values/alcohol/daniels";
import { nostrildamus } from "../brew-values/gravity/finalgravity/nostrildamus";
import { simple as OgFormula } from "../brew-values/gravity/originalgravity/simple";

import { strikeTemp } from '../brew-values/strike-temp';

export const citra = new Hop("citra", new Percent(12.5));
export const paleAle = new Malt('Pale Ale', new ExtractPotential(new GravityPoints(17)), 'grain');
export const us05 = new Yeast('US-05', new Factor(0.81));

const tenMin = new Minutes(10);

export type Ingredients = {
    hops: ObservableArray<HopAddition>,
    maltBill: ObservableArray<MaltAddition>,
    yeast: Yeast,
}
export const LeSec = {
    hops: new ObservableArray(new HopAddition(citra, new Grams(1), tenMin)),
    maltBill: new ObservableArray(new MaltAddition(paleAle, new Kilos(1))),
    yeast: us05,
};

export class Recipe {
    ingredients: {
        hops: ObservableArray<HopAddition>,
        maltBill: ObservableArray<MaltAddition>,
        yeast: Yeast,
    };
    bitterness: IBU;
    desiredBoilVolume: Liters;
    preBoilVolume: Liters;
    postBoilVolume: Liters;
    boilGravity: SpecificGravity;
    maltWeight: Kilos;
    boilTime: Minutes;

    originalGravity: SpecificGravity;
    efficiency: Factor;
    finalGravity: SpecificGravity;
    alcohol: ABV;
    maxBoilVolume: Liters;
    bottleVolume: Liters;
    trubLoss: Liters;
    mashLoss: Liters;
    equipmentLoss: Liters;

    mashTemp: Celsius;
    grainTempPreMash: Celsius;
    strikeTemp: Celsius;

    constructor(ingredientsList: Ingredients) {
        this.ingredients = ingredientsList;
        ingredientsList.hops.setName('hop schedule');
        ingredientsList.maltBill.setName('malt bill');
        ingredientsList.yeast.getAttenuation().setName('yeast attenuation');

        this.bottleVolume = new Liters(4);
        this.boilTime = new Minutes(60);
        this.efficiency = new Factor(0.7);

        this.maltWeight = new Kilos({
            fn: this._maltWeight.bind(this),
            deps: [this.ingredients.maltBill],
        });
        
        this.maxBoilVolume = new Liters(12);
        this.trubLoss = new Liters(0.5);
        this.mashLoss = new Liters(1);
        this.equipmentLoss = sum(Liters, this.trubLoss, this.mashLoss);

        this.preBoilVolume = sum(Liters, this.boilTime, this.equipmentLoss);
        this.preBoilVolume = biabWater(this.maltWeight, this.preBoilVolume);
        this.preBoilVolume = min(
            Liters,
            this.maxBoilVolume,
            biabWater(
                this.maltWeight,
                minus(Liters, this.bottleVolume, this.equipmentLoss).setName('bottle-equipment loss'),
            ).setName('biabWater'),
        );
        this.postBoilVolume = adjustForBoilOff(
            this.preBoilVolume,
            this.boilTime
        );

        this.boilGravity = OgFormula(this.ingredients.maltBill,
            this.preBoilVolume,
            this.efficiency
        );
        this.bitterness = tinseth(this.ingredients.hops, this.preBoilVolume, this.boilGravity);

        this.originalGravity = OgFormula(
            this.ingredients.maltBill,
            this.postBoilVolume,
            this.efficiency
        );
        this.finalGravity = nostrildamus(this.originalGravity, this.ingredients.yeast.getAttenuation());
        this.alcohol = daniels(this.originalGravity, this.finalGravity);

        this.mashTemp = new Celsius(68);
        this.grainTempPreMash = new Celsius(18);
        this.strikeTemp = strikeTemp(this.preBoilVolume, this.maltWeight, this.mashTemp, this.grainTempPreMash);

        this._setupDebugNames();
    }

    _maltWeight(): number {
        return this.ingredients.maltBill.toArray().reduce(
            (total, maltAddition) => {
                return total + maltAddition.getWeight().value();
            },
            0,
        );
    }

    _setupDebugNames() {
        for (const propName of Object.keys(this)) {
            const value = (this: any)[propName];
            if (value instanceof Unit) {
                value.setName(propName);
            }
        }
    }
}

function sum(resultType: any, ...units: Array<Unit>): * {
    const fn = () => units.reduce(
        (total, unit) => {
            return total + unit.value();
        },
        0,
    );

    return new resultType({
        fn: fn,
        deps: units,
    });
}

function minus(resultType: any, ...units: Array<Unit>): * {
    const first = units.shift();
    const fn = () => units.reduce(
        (total, unit) => {
            return total - unit.value();
        },
        first.value(),
    );

    return new resultType({
        fn: fn,
        deps: [first, ...units],
    });
}

function min(resultType: any, ...units: Array<Unit>): * {
    const fn = () => {
        let min = units[0].value();
        for (const unit of units) {
            const val = unit.value();
            if (val < min) {
                min = val;
            }
        }
        return min;
    };

    return new resultType({
        fn: fn,
        deps: units,
    });
}
