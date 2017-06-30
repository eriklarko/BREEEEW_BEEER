// @flow

import { Kilos, Liters } from '../units';

function biabWaterInternal(maltWeight: Kilos, desiredPreBoilVolume: Liters): number {
    return desiredPreBoilVolume.value() + 0.9 * maltWeight.value();
}

export function biabWater(maltWeight: Kilos, desiredPreBoilVolume: Liters): Liters {
    const a = {
        fn: () => biabWaterInternal(maltWeight, desiredPreBoilVolume),
        deps: [maltWeight, desiredPreBoilVolume],
    };

    return new Liters(a);
}
