// @flow

import { SpecificGravity, ABV } from '../../units';

/*
* Taken from
* http://www.brewersfriend.com/2011/06/16/alcohol-by-volume-calculator-updated/
*
* ABV = (76.08 * (og-fg) / (1.775-og)) * (fg / 0.794)
*/
export function daniels(originalGravity: SpecificGravity, finalGravity: SpecificGravity): ABV {
    return new ABV({
        fn: () => internal(originalGravity, finalGravity),
        deps: [originalGravity, finalGravity],
    });
}

function internal(originalGravity: SpecificGravity, finalGravity: SpecificGravity): number {
    const og = originalGravity.value();
    const fg = finalGravity.value();

    return (76.08 * (og - fg) / (1.775 - og)) * (fg / 0.794);
}

