import { Kilos, Liters } from '../units';
import { BrewValue, ReactiveBrewValue } from "../observable";

function biabWaterInternal(maltWeight: Kilos, desiredPreBoilVolume: Liters): Liters {
    return new Liters(desiredPreBoilVolume.value() + 0.9 * maltWeight.value());
}

export function biabWater(
    maltWeight: BrewValue<Kilos>,
    desiredPreBoilVolume: BrewValue<Liters>
): ReactiveBrewValue<Liters> {

    const initialValue = new Liters(0);
    
    return new ReactiveBrewValue(initialValue, () => {
        const a = maltWeight.get();
        const b = desiredPreBoilVolume.get();

        return biabWaterInternal(a, b);
    }, maltWeight, desiredPreBoilVolume);
}
