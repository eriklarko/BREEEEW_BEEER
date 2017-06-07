// @flow

import { ObservableArray } from '../observable';
import { HopAddition, Hop } from "../brew-values/hops";
import { MaltAddition, Malt } from "../brew-values/malt";
import { Yeast } from "../brew-values/yeast";
import { Minutes, Grams, Percent, Liters, SpecificGravity, IBU, Kilos } from '../units';
import { tinseth } from "../brew-values/bitterness/tinseth";
import { biabWater } from "../brew-values/biab-water";

export const citra = new Hop("citra", new Percent(12.5));
export const paleAle = new Malt('Pale Ale');
export const us05 = new Yeast('US-05');

const tenMin = new Minutes(10);

export const LeSec = {
    hops: new ObservableArray(new HopAddition(citra, tenMin, new Grams(1))),
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

    constructor(ingredientsList: any) {
        this.ingredients = ingredientsList;

        this.desiredBoilVolume = new Liters(4);
        this.boilGravity = new SpecificGravity(1);
        console.log('WEIGHT', this.maltWeight());
        this.boilVolume = biabWater(this.maltWeight(), this.desiredBoilVolume);
        this.bitterness = tinseth(this.ingredients.hops, this.boilVolume, this.boilGravity);
    }

    maltWeight(): Kilos {
        const a =  this.ingredients.maltBill.toArray().reduce(
            (total, maltAddition) => {
                console.log('total before', total);
                console.log(total.value(), maltAddition.getWeight().value());
                total.set(
                   total.value() + maltAddition.getWeight().value()
                );
                console.log('total after', total);
                return total;
            },
            new Kilos(0),
        );

        console.log('YATTA', a);
        return a;
    }
}

