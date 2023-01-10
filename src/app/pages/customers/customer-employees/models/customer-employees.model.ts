import {Customer} from "../../customer/models/customer.model";
import {Employee} from "../../../employees/employee/models/employee.model";

export class CustomerEmployees {
  id:any;
  customer:Customer;
  employee:Employee;
  status:string;
  registerDate:any;
  observations:string;
}
