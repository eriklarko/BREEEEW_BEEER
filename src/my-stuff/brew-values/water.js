// @flow

import { Liters, Minutes } from '../units';

const boilOffPerHour = new Liters(1);

export function adjustForBoilOff(preBoilVolume: Liters, boilTime: Minutes): Liters {
    return new Liters({
        fn: () => a(preBoilVolume, boilTime),
        deps: [preBoilVolume, boilTime],
    });
}


function a(preBoilVolume: Liters, boilTime: Minutes): number {
    return preBoilVolume.value() + boilOffPerHour.value() * boilTime.asHours().value();
}

