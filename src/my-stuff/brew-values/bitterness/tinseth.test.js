// @flow

import { ObservableArray } from "../../observable";
import { HopAddition, Hop } from "../hops";
import { Grams, Minutes, Percent, Liters, SpecificGravity } from "../../units";
import { tinseth } from "./tinseth";

describe('tinseth', () => {

    const ha1 = new HopAddition(
        new Hop("", new Percent(1)),
        new Grams(2),
        new Minutes(3)
    );
    const ha2 = new HopAddition(
        new Hop("", new Percent(6)),
        new Grams(7),
        new Minutes(8)
    );

    it('changes when a new hop addition is added', () => {
        const hopAdditions = new ObservableArray(ha1);
        const bitterness = tinseth(hopAdditions, new Liters(4), new SpecificGravity(5)); 
        const before = bitterness.value();

        hopAdditions.push(ha2);
        expect(bitterness.value()).not.toBe(before);
    });

    it("changes when a hop addition's time changes", () => {
        const ha = new HopAddition(
            new Hop("", new Percent(6)),
            new Grams(7),
            new Minutes(8)
        );
        const hopAdditions = new ObservableArray(ha);

        const bitterness = tinseth(hopAdditions, new Liters(4), new SpecificGravity(1.030)); 
        
        const before = bitterness.value();
        ha.setTimeInBoil(new Minutes(9));

        expect(bitterness.value()).not.toBe(before);
    });
});
