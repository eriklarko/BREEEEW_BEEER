// @flow

import { Celsius, Kilos, Liters } from '../units';
import { strikeTemp } from './strike-temp';

it('works for one example', () => {
    const expectedStrikeTemp = new Celsius(76.2);

    const mashVolume = new Liters(11.25);
    const grainWeight = new Kilos(4.5);
    const mashTemp = new Celsius(68);
    const grainTemp = new Celsius(18);

    const actual = strikeTemp(mashVolume,
        grainWeight,
        mashTemp,
        grainTemp,
    );

    expect(actual.value()).toBe(expectedStrikeTemp.value());
});
