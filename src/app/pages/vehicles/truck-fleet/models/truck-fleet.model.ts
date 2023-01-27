import { Providers } from "src/app/pages/providers/provider/models/providers.model";

export class TruckFleet {
    id: any;
    tractPlate?: string;
    vanPlate: string;
    brand: string;
    volume: any;
    fabricationDate: any;
    tonany: any;
    tonNumber: any;
    axes: any;
    model: string;
    highWideLong: string;
    fleetType: string;
    provider: Providers;
}