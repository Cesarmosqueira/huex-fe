import {Providers} from "../../provider/models/providers.model";

export class TireReplacement {
  id:any;
  provider:Providers;
  replacementDate:any;
  tireQuantity:number;
  unitPrice:number;
  brand:string;
  model:string;
  observation:string;
}
