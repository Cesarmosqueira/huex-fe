import {TruckFleet} from "../../truck-fleet/models/truck-fleet.model";

export class MaintenanceOil {
    id: any;
    truckFleet: TruckFleet;
    changeType: number;
    place: string;
    dateChange: string;
    kmLast: number;
    kmCurrent:number;
    kmNext: number;
    status: number;
    dateCurrent: string;
    differences: number;
}
