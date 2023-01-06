import { Menu } from "src/app/core/models/menu-response.model";
import { Employee } from "src/app/pages/employees/employee/models/employee.model";

export class User {
    id: number;
    userName: string;
    employee: Employee;
    zone: string;
    password: number;
    role: number;
    active: any;
    initial: number;
    menus: Menu[];
}