// @flow

const realLog = console.log;
console = {
    log: () => {},
}

import { Kilos, Liters, SpecificGravity, Percent, Grams, Minutes } from './units';
import { ObservableArray } from "./observable";
import { biabWater } from './brew-values/biab-water'
import { tinseth } from './brew-values/bitterness/tinseth'
import { HopAddition, Hop } from './brew-values/hops';

it('changes value when a dependency is updated', () => {
    const desiredPreBoilVolume = new Liters(1);
    const maltWeight = new Kilos(1);
    const mashVolume = biabWater(maltWeight, desiredPreBoilVolume);
    expect(mashVolume.value()).toBe(1.9);

    maltWeight.set(new Kilos(2));
    expect(mashVolume.value()).toBe(2.8);
});

it('works with tinseth', () => {
    const has = new ObservableArray(new HopAddition(
            new Hop("apa", new Percent(3)),
            new Grams(5),
            new Minutes(7)

        ), new HopAddition(
            new Hop("apa", new Percent(11)),
            new Grams(13),
            new Minutes(17)
    ));
    const cbv = new Liters(19);
    const cbg = new SpecificGravity(23);

    const ibu = tinseth(has, cbv, cbg);
    expect(ibu.value()).toBe(2.1047766144504525e-85);

    cbv.set(new Liters(2));
    expect(ibu.value()).toBe(1.99953778372793e-84);

    cbg.set(new SpecificGravity(2));
    expect(ibu.value()).toBe(0.01844248088107077);


    has.push(new HopAddition(
        new Hop("apa", new Percent(11)),
        new Grams(13),
        new Minutes(17)
    ));
    expect(ibu.value()).toBe(0.03597466772615196);
});

it('works with chained reactive values', () => {
    const has = new ObservableArray(new HopAddition(
            new Hop("apa", new Percent(3)),
            new Grams(5),
            new Minutes(7)

        ), new HopAddition(
            new Hop("apa", new Percent(11)),
            new Grams(13),
            new Minutes(17)
    ));
    const cbg = new SpecificGravity(23);




    const desiredPreBoilVolume = new Liters(1);
    const maltWeight = new Kilos(1);
    const mashVolume = biabWater(maltWeight, desiredPreBoilVolume);

    const ibu = tinseth(has, mashVolume, cbg);

    const firstValue = ibu.value();
    console.log('SETTING THE MALTWEIGHT');
    maltWeight.set(new Kilos(2));
    console.log('GETTING THE IBU');
    expect(ibu.value()).not.toBe(firstValue);
});

it('works with a reactive value set to manual', () => {
    // 1. setup tinseth with automatic biabwater
    const maltWeight = new Kilos(1);
    const desiredPreBoilVolume = new Liters(2);
    const boilgravity = new SpecificGravity(3);
    const hops = new ObservableArray(new HopAddition(
        new Hop("a", new Percent(4)),
        new Grams(5),
        new Minutes(6),
    ));
    
    const mashVol = biabWater(maltWeight, desiredPreBoilVolume);
    const ibu = tinseth(hops, mashVol, boilgravity);

    // 2. store tinseth value
    const autoIbus = ibu.value();

    // 3. set biabwater to automatic
    mashVol.set(new Liters(7));

    // 4. tinseth should change
    const manualIbus = ibu.value();
    expect(manualIbus).not.toBe(autoIbus);

    // 5. Change a dependency of biabwater
    maltWeight.set(new Kilos(8));

    // 6. biabWater should not change
    expect(mashVol.value()).toBe(7);

    //7. ibus shouldn't change either
    expect(ibu.value()).toBe(manualIbus);
});
