// @flow
import { Kilos, Liters } from "../units";
import { biabWater } from "./biab-water";

describe('biab water', () => {
    
    it('changes value when the malt weight changes', () => {
        const maltWeight = new Kilos(1);
        const desiredPreBoilVolume = new Liters(2);

        const mashVolume = biabWater(maltWeight, desiredPreBoilVolume);
        const before = mashVolume.value();
        maltWeight.set(3);

        expect(mashVolume.value()).not.toBe(before);
    });

    it('does not change when set to manual', () => {
        const maltWeight = new Kilos(1);
        const desiredPreBoilVolume = new Liters(2);

        const mashVolume = biabWater(maltWeight, desiredPreBoilVolume);
        mashVolume.set(3);
        
        const before = mashVolume.value();
        maltWeight.set(4);

        expect(mashVolume.value()).toBe(before);
        
    });
});
