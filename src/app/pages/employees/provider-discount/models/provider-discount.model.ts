import {Providers} from "../../../providers/provider/models/providers.model";

export class ProviderDiscount {
  id:any;
  provider:Providers;
  date:any;
  observations:string;
  status:string;
  charge:number;
}
