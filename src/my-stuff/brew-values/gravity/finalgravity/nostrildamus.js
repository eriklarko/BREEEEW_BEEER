// @flow

import { SpecificGravity, Factor } from "../../../units";

/*
* Taken from http://www.homebrewtalk.com/f13/estimate-final-gravity-32826/#post322609
* 1.055 = 55 GU * 0.25 = 13.75 or 1.01375
* FG = (OG - 1)*1000 * (1 - AA) / 1000
*    = (OG - 1) * (1 - AA) + 1
*
*/
export function nostrildamus(og: SpecificGravity, yeastAttenuation: Factor): SpecificGravity {
    return new SpecificGravity({
        fn: () => internal(og, yeastAttenuation),
        deps: [og, yeastAttenuation],
    });
}

function internal(og: SpecificGravity, yeastAttenuation: Factor): number {
    return (og.value() - 1) * (1 - yeastAttenuation.value()) + 1;
}

