// @flow

import { USGallons, Factor, Lbs, Liters, SpecificGravity, GravityPoints, ExtractPotential } from '../../../units';
import { MaltAddition } from '../../malt';
import { ObservableArray } from '../../../observable';

/**
*
* Taken from
* http://byo.com/european-pale-lager/item/409-calculating-gravity-bitterness-and-color-techniques and
* http://brewgr.com/calculations/original-gravity
*
* SGP(GP/gal) = [W(lb.) * EP(GP/lb.) * EE] / V(gallons)
*
* SGP(GP/l) = [W(kg) * EP(GP/kg) * EE] / V(l)
*
* SG = SGP / 1000 + 1
*
*
*
* 1 Lb  = 0.45359237 kilograms = a kg
* 1 gal = 3.78541178 liters    = b liters
* SGP(GP/(b*l)     = [W(a*kg) * EP(GP/(b*l)) * EE] / V(b*l)
* SGP(GP/(gal*b*l) = [(lbs*a*kg) * (GP/(lbs*a*kg)) * EE] / (gal*b*l)
*                  = [(lbs*a*kg) * (GP/( 1 *a*kg)) * EE] / (gal*b*l)
*                  = [(lbs*a*kg) * EE] / (gal*b*l) * (GP/( 1 *a*kg))
*                  = [(lbs*a*kg) * EE * GP] / (gal*b*l*a*kg)
*                  = (lbs * EE * GP) / (gal * b * l)
*
* GP / (gal * b * l) = (lbs * EE * GP) / (gal * b * l)
* GP = lbs * EE * GP
*
*/

class LbsExtractPotential {
    _value: number;

    /**
     *  EE(GP/Kg) = GP / Kg
     *  EE(GP/Lbs) = GP / Lbs
     *
     *  EE(GP/Lbs) = GP / (2.20462262 * Kg)
     *  EE(GP/Kg)  = GP / (Lbs / 2.20462262)
     */
    constructor(value: ExtractPotential) {
        this._value = value.getGravityPoints().value() * new Lbs(value.getWeight()).value();
    }

    value(): number {
        return this._value;
    }
}

export function simple(gristParts: ObservableArray<MaltAddition>,
                       preBoilVolume: Liters,
                       efficiency: Factor): SpecificGravity {

    const volAsGal = new USGallons(preBoilVolume);

    return new SpecificGravity({
        fn: () => calc(gristParts.toArray(),
                       volAsGal,
                       efficiency)
                  .value(),

        deps: [gristParts, preBoilVolume, efficiency],
    });
}

function calc(gristParts: Array<MaltAddition>,
              preBoilVolume: USGallons,
              efficiency: Factor): SpecificGravity {

    let total = 0;
    for (const gp of gristParts) {

        const grainWeight = new Lbs(gp.getWeight());

        const eff = gp.getMalt().getType() === 'extract'
            ? new Factor(1)
            : efficiency;

        const ep = new LbsExtractPotential(gp.getMalt().getExtractPotential());

        total += calcForOneGristPart(grainWeight, ep, eff);
    }

    return new GravityPoints(total / preBoilVolume.value()).toSpecificGravity();
}

function calcForOneGristPart(grainWeight: Lbs,
                             extractPotential: LbsExtractPotential,
                             extractionEfficiency: Factor): number {

    return grainWeight.value() * extractPotential.value() * extractionEfficiency.value();
}

