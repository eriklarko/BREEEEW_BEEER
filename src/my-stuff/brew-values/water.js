// @flow

import { Liters, Minutes } from '../units';
import { ReactiveObservable } from '../observable';

const boilOffPerHour = new Liters(1);

//export function adjustForBoilOff(preBoilVolume: Liters, boilTime: Minutes): ReactiveObservable<Liters> {
export function adjustForBoilOff(preBoilVolume: Liters, boilTime: Minutes): Liters {
    return new ReactiveObservable(null, () => return a(preBoilVolume, boilTime), preBoilVolume, boilTime);
}


function a(preBoilVolume: Liters, boilTime: Minutes): Liters {
    return new Liters(preBoilVolume.value() + boilOffPerHour.value() * boilTime.asHours().value());
}

