// @flow

import { SpecificGravity } from '../../../units';

/**
 * Calculates the boil gravity as the mean of the pre-boil gravity and
 * post-boil gravity.
 */
export function average(preBoil: SpecificGravity, postBoil: SpecificGravity): SpecificGravity {
    return new SpecificGravity({
        fn: () => (preBoil.value() + postBoil.value()) / 2,
        deps: [preBoil, postBoil],
    });
}

