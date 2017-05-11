// @flow

import { Kilos, Liters } from '../units';
import { ReactiveBrewValue } from "../observable";

function biabWaterInternal(maltWeight: Kilos, desiredPreBoilVolume: Liters): Liters {
    return new Liters(desiredPreBoilVolume.value() + 0.9 * maltWeight.value());
}

export function biabWater(
    maltWeight: Kilos,
    desiredPreBoilVolume: Liters
): ReactiveBrewValue<Liters> {

    const initialValue = new Liters(0);
    
    return new ReactiveBrewValue(initialValue, () => {

        return biabWaterInternal(maltWeight, desiredPreBoilVolume);
    }, maltWeight, desiredPreBoilVolume);
}
