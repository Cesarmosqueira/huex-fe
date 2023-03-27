import {TruckFleet} from "../../truck-fleet/models/truck-fleet.model";

export class MaintenanceOil {
    id: any;
    provider:any;
    employee:any;
    truckFleet: TruckFleet;
    changeType: number;
    place: string;
    dateChange: string;
    kmLast: number;
    kmCurrent:number;
    kmNext: number;
    status: string;
    dateCurrent: any;
    differences: number;
    changeKm:number;
}
