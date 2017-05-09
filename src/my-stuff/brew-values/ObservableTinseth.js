// @flow

import { tinseth } from './bitterness/tinseth';
import { BrewValue } from '../observable';
import { Liters, SpecificGravity, IBU } from '../units';

export class LeIbu extends BrewValue<IBU> {

    constructor() {
        const hopAdds = [];
        const boilVol = new Liters(1);
        const boilGrav = new SpecificGravity(1);

        super(new IBU(0), () => tinseth(hopAdds, boilVol, boilGrav)/*, hopAdds, boilVol, boilGrav*/);
    }
}
