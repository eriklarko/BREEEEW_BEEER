// @flow

//import { it, expect } from "jest";
import { Kilos, Liters } from './units';
import { BrewValue, ReactiveBrewValue } from "./observable";

it('changes value when a dependency is updated', () => {

    const desiredPreBoilVolume = new BrewValue(new Liters(1));
    const maltWeight = new BrewValue(new Kilos(1));
    const mashVolume = apa(maltWeight, desiredPreBoilVolume);
    mashVolume.makeAuto();
    console.log('first assert');
    expect(mashVolume.get().value()).toBe(1.9);

    console.log('setting mw');
    maltWeight.set(new Kilos(2));
    console.log('second assert');
    expect(mashVolume.get().value()).toBe(2.8);
});

function BiabWater(maltWeight: Kilos, desiredPreBoilVolume: Liters): Liters {
    return new Liters(desiredPreBoilVolume.value() + 0.9 * maltWeight.value());
}

function apa(maltWeight: BrewValue<Kilos>, desiredPreBoilVolume: BrewValue<Liters>): ReactiveBrewValue<Liters> {
    return new ReactiveBrewValue(new Liters(0), () => {
        const a = maltWeight.get();
        const b = desiredPreBoilVolume.get();

        return BiabWater(a, b);
    }, maltWeight, desiredPreBoilVolume);
}
