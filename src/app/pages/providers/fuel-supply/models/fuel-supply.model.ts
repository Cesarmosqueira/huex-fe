import {Providers} from "../../provider/models/providers.model";

export class FuelSupply {
  id:any;
  provider:Providers;
  dateFuel:any;
  fuelQuantity:number;
  gallonPrice:number;
  observation:string;
}
