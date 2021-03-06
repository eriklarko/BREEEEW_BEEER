// @flow
import { ObservableArray } from '../../observable';
import { HopAddition } from '../hops';
import { Liters, SpecificGravity, IBU } from '../../units';

export function tinseth(hopAdditions: ObservableArray<HopAddition>, currentBoilVolume: Liters, currentBoilGravity: SpecificGravity): IBU {
    return new IBU({
        fn: () => tinsethInternal(hopAdditions.toArray(), currentBoilVolume, currentBoilGravity),
        deps: [hopAdditions, currentBoilVolume, currentBoilGravity],
    });
}

function tinsethInternal(hopAdditions: Array<HopAddition>, currentBoilVolume: Liters, currentBoilGravity: SpecificGravity): number {
    return hopAdditions.reduce((acc, ha) => acc + getRawIBUsForAddition(ha, currentBoilVolume, currentBoilGravity), 0) 
}

function getRawIBUsForAddition(addition, boilVolume, boilGravity) {
    
    const alpha = addition.getHop().getAlphaAcids().asFactor().value();
    const mass = addition.getAmount();
    const time = addition.getTimeInBoil();

    const milligramsPerLiter = (alpha * mass.value() * 1000) / boilVolume.value();
    const utilization = getUtilization(boilGravity, time);

    return milligramsPerLiter * utilization;
}

function getUtilization(boilGravity, timeInBoil) {
    let util = 1.65 * Math.pow(0.000125, boilGravity.value() - 1);
    util = util * (1 - Math.exp(-0.04 * timeInBoil.value()));
    util = util / 4.15;

    return util;
}

