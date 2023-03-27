import { FuelSupply } from "src/app/pages/providers/fuel-supply/models/fuel-supply.model";
import { TruckFleet } from "../../truck-fleet/models/truck-fleet.model";

export class KardexFuel {
    id: number;
    fuelSupply: FuelSupply;
    tractPlate: string;
    date: string;
    amountFuel: number;
    mileage: number;
    dutyManager: string;
    operation: string;
    unitPrice: number;
}