// @flow

import { Lbs, Kilos, Liters, USGallons } from './units';

it('should convert kgs to lbs', () => {

    expect(new Lbs(new Kilos(1)).value()).toBe(2.20462262);
});

it('should convert lbs to kgs', () => {

    expect(new Kilos(new Lbs(1)).value()).toBe(0.4535923703803783);
});


it('should convert liters to US gallons', () => {
    expect(new USGallons(new Liters(1)).value()).toBe(0.264172);
})

it('should convert US gallons to liters', () => {
    expect(new Liters(new USGallons(1)).value()).toBe(3.785412534257983);
})
