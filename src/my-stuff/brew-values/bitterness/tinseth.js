class Liter{
    value() {
        return 10;
    }
}
class SpecificGravity{
    value() {
        return 10;
    }
}
class Minutes {
    value() {
        return 10;
    }
}
class Grams{
    value() {
        return 10;
    }
}
class Factor {
    // 0.xyz
    value() {
        return 0.1;
    }
}
class Hop {
    getAlphaAcids() {
        return new Factor();
    }
}
class HopAddition {
    getHop() {
        return new Hop();
    }

    getAmount() {
        return new Grams();
    }

    getTimeInBoil() {
        return new Minutes();
    }
}

export function tinseth(hopAdditions: Array<HopAddition>, currentBoilVolume: Liter, currentBoilGravity: SpecificGravity) {
    return hopAdditions.reduce((acc, v) => acc + getRawIBUsForAddition(v, currentBoilVolume, currentBoilGravity), 0) 
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

