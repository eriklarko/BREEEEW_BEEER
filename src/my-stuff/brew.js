// @flow

export class Brew {
    name: string = "";
    brewDate: Date = new Date();
    og: number = 0;

    kgGrainsToMash: number;

    boilWater: {
        toWarm: ?number,
        toBoil: number,
        inFermenter: ?number,
    } = {
        toWarm: undefined,
        toBoil: 2,
        inFermenter: undefined,
    };

    _setState(newState) {
        // TODO: Should work like react's does
    }

    setAmountToBoil(toBoil: number) {
        const toWarm = toBoil + this.kgGrainsToMash * 0.9;

        const boilOff = 1;
        const trub = 0.5;
        const inFermenter = toBoil - boilOff - trub;

        this.boilWater.toWarm = toWarm;
        this.boilWater.inFermenter = inFermenter;
        this.boilWater.toBoil = toBoil;
    }

    setDesiredLitersInFermenter(inFermenter: number) {
        const boilOff = 1;
        const trub = 0.5;
        const toBoil = inFermenter + boilOff + trub;

        const toWarm = toBoil + this.kgGrainsToMash * 0.9;

        this.boilWater.toWarm = toWarm;
        this.boilWater.toBoil = toBoil;
        this.boilWater.inFermenter = inFermenter;
    }

    setAmountOfGrainsToMash(kgGrains: number) {
        this.kgGrainsToMash = kgGrains;
        const toWarm = this.boilWater.toBoil + kgGrains * 0.9;
        this.boilWater.toWarm = toWarm;
    }
}
