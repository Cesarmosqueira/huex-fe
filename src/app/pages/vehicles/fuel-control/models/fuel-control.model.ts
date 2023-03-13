import {Tracking} from "../../../services/tracking/models/tracking.model";

export class FuelControl {

  id:any;
  trackingService:Tracking;
  firstPlace:string;
  firstQuantity:number;
  secondPlace:string;
  secondQuantity:number;
  thirdPlace:string;
  thirdQuantity:number;
  fourthPlace:string;
  forthQuantity:number;
  fifthPlace:string;
  fifthQuantity:number;
  sixthPlace:string;
  sixthQuantity:number;
  totalGallons:number;
  target:number;
  difference:number;
  observation:string;
}
