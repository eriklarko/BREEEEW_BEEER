// @flow

import { Malt, MaltAddition } from '../../malt';
import { Lbs, Factor, USGallons, Liters, SpecificGravity, GravityPoints, ExtractPotential, Kilos } from '../../../units';
import { simple } from './simple';
import { ObservableArray } from '../../../observable';

/**
* You plan to use 3.5 lbs. malt extract, plus 4.5 lbs. pale malt and 1/2 lb.
* crystal malt (40° Lovibond). Your extraction efficiency, from before,
* was 83%. From Table 1, you can see that dried malt extract yields 45 GP/lb.
* Extraction efficiency for malt extract is always 100%, so its extraction
* efficiency is 1.0. The extract potential for pale malt is 36 GU/lb.,
* while the EP for the crystal is 30. Substituting the numbers for
* the variables gives you:
*
*   SGP = [3.5*45*1.00]/5 + [4.5*36 *0.83]/5 + [0.5*30*0.83]/5 = 60.882
*   -> 1.060882
*
*  45 GP/Lbs = x GP/Kg, 45 / Lbs.CONVERSION_FACTOR
*  36 GP/Lbs = x GP/Kg
*  30 GP/Lbs = x GP/Kg
*/

it('original gravity test', () => {
    const lbsConversionFactor = 2.20462262;

    const mExtract = new Malt('extract',
        new ExtractPotential(new GravityPoints(45 / lbsConversionFactor), new Kilos(1)),
        'extract');
    const mPale = new Malt('pale',
        new ExtractPotential(new GravityPoints(36 / lbsConversionFactor), new Kilos(1)),
        'grain');
    const mCrystal = new Malt('crystal',
        new ExtractPotential(new GravityPoints(30 / lbsConversionFactor), new Kilos(1)),
        'grain');

    const extract = new MaltAddition(mExtract, new Kilos(new Lbs(3.5)));
    const pale = new MaltAddition(mPale, new Kilos(new Lbs(4.5)));
    const crystal = new MaltAddition(mCrystal, new Kilos(new Lbs(0.5)));
    const gristParts = new ObservableArray(extract, pale, crystal);

    const extractionEfficiency = new Factor(0.83);
    const volumeG = new USGallons(5);
    const volumeL = new Liters(volumeG);

    const ogMetric = simple(gristParts, volumeL, extractionEfficiency);

    const expected = "1.060882";

    expect(ogMetric.value().toFixed(6)).toBe(expected);
});
