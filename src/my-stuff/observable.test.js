// @flow

//import { it, expect } from "jest";
import { Kilos, Liters, SpecificGravity, Percent, Grams, Minutes } from './units';
import { BrewValue, ReactiveBrewValue } from "./observable";
import { biabWater } from './brew-values/biab-water'
import { tinseth } from './brew-values/bitterness/tinseth'
import { HopAddition, Hop } from './brew-values/hops';

it('changes value when a dependency is updated', () => {

    const desiredPreBoilVolume = new BrewValue(new Liters(1));
    const maltWeight = new BrewValue(new Kilos(1));
    const mashVolume = biabWater(maltWeight, desiredPreBoilVolume);
    mashVolume.makeAuto();
    expect(mashVolume.get().value()).toBe(1.9);

    maltWeight.set(new Kilos(2));
    expect(mashVolume.get().value()).toBe(2.8);
});

it.only('works with tinseth', () => {
    const has = [new BrewValue(new HopAddition(
            new Hop("apa", new Percent(3)),
            new Grams(5),
            new Minutes(7)

        )), new BrewValue(new HopAddition(
            new Hop("apa", new Percent(11)),
            new Grams(13),
            new Minutes(17)
    ))];
    const cbv = new BrewValue(new Liters(19));
    const cbg = new BrewValue(new SpecificGravity(23));

    const ibu = tinseth(has, cbv, cbg);
    ibu.makeAuto();
    expect(ibu.get().value()).toBe(2.1047766144504525e-85);

    cbv.set(new Liters(2));
    expect(ibu.get().value()).toBe(1.99953778372793e-84);

    cbg.set(new SpecificGravity(2));
    expect(ibu.get().value()).toBe(0.01844248088107077);
});
