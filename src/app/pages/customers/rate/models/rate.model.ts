import {Customer} from "../../customer/models/customer.model";
import {Route} from "../../route/models/route.model";

export class Rate {

  id:any;
  customer:Customer;
  route:Route;
  leadTime:number;
  volume:number;
  cost:number;
  observationRate:string;
}
