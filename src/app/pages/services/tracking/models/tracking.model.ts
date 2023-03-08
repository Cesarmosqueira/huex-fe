import {Employee} from "../../../employees/employee/models/employee.model";

export class Tracking {
	id: any;
	dateService: any;
	truckFleet: any;
	destinationDetail: string;
	numberPoints: any;
	serviceType: string;
	additionalCost: string;
	observations: string;
	guideNumber: string;
	datePrecharge: Date;
	preloadStatus: string;
	scheduledAppointment: Date;
	rate: any;
	driver: Employee;
	copilot: Employee;
	stevedore: Employee;
	dateTimeCompletion: Date;
	moneyDelivered: any;
	detailMoney: string;
	operation: string;
	condition: string;
	photoInsurance: any;
	invoiced: string;
	charge: string;
  documentaryStatus:string
}
