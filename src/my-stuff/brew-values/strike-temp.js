// @flow

import { Liters, Kilos, Celsius } from '../units';

const MASH_EQUATION_CONSTANT = 0.41;

export function strikeTemp(
    mashvolume: Liters,
    grainweight: Kilos,
    targettemp: Celsius,
    graintemp: Celsius,
): Celsius {
    return new Celsius({
        fn: () => calc(
            mashvolume.value(),
            grainweight.value(),
            targettemp.value(),
            graintemp.value(),
        ),
        deps: arguments,
    });
}
function calc(mashvolume: number,
    grainweight: number,
    targettemp: number,
    graintemp: number,
) {
    if (grainweight < 0) {
        throw new Error('Grain weight must be greater than zero');
    }

    const mashratio = mashvolume / grainweight

    const striketemp = ((MASH_EQUATION_CONSTANT / mashratio) * (targettemp - graintemp)) + targettemp;

    /*if (striketemp > boilingtemp) {
        throw new Error('The calculated strike temperature is above boiling, this means you will need to increase your mash water/grain ratio.')
    }*/

    return striketemp;
}

