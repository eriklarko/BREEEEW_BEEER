// @flow

import { ObservableArray } from '../observable';
import { HopAddition, Hop } from "../brew-values/hops";
import { MaltAddition, Malt } from "../brew-values/malt";
import { Yeast } from "../brew-values/yeast";
import { Unit, Minutes, Grams, Percent, Liters, SpecificGravity, IBU, Kilos, ABV } from '../units';
import { tinseth } from "../brew-values/bitterness/tinseth";
import { biabWater } from "../brew-values/biab-water";
import { adjustForBoilOff } from "../brew-values/water";
import { daniels } from "../brew-values/alcohol/daniels";

export const citra = new Hop("citra", new Percent(12.5));
export const paleAle = new Malt('Pale Ale');
export const us05 = new Yeast('US-05');

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
    };
    bitterness: IBU;
    desiredBoilVolume: Liters;
    boilVolume: Liters;
    boilGravity: SpecificGravity;
    maltWeight: Kilos;
    boilTime: Minutes;

    originalGravity: SpecificGravity;
    finalGravity: SpecificGravity;
    alcohol: ABV;

    constructor(ingredientsList: Ingredients) {
        this.ingredients = ingredientsList;
        ingredientsList.hops.setName('hop schedule');
        ingredientsList.maltBill.setName('malt bill');

        this.desiredBoilVolume = new Liters(4);
        this.boilGravity = new SpecificGravity(1);
        this.boilTime = new Minutes(60);

        this.maltWeight = new Kilos({
            fn: this._maltWeight.bind(this),
            deps: [this.ingredients.maltBill],
        });
        
        const _biabWater = biabWater(this.maltWeight, this.desiredBoilVolume);
        _biabWater.setName('biabWater');
        this.boilVolume = adjustForBoilOff(
            _biabWater,
            this.boilTime
        );
        this.bitterness = tinseth(this.ingredients.hops, this.boilVolume, this.boilGravity);

        this.originalGravity = new SpecificGravity(1.050);
        this.finalGravity = new SpecificGravity(1.010);
        this.alcohol = daniels(this.originalGravity, this.finalGravity);

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

