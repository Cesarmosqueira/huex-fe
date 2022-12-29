import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [

  {
    id: 1,
    label: 'MENUITEMS.EMPLOYEES.TEXT',
    icon: 'bx-store',
    subItems: [
      {
        id: 2,
        label: 'MENUITEMS.EMPLOYEES.LIST.EMPLOYEE',
        link: '/employees/employee',
        parentId: 1
      },
      {
        id: 2,
        label: 'MENUITEMS.EMPLOYEES.LIST.IMPLEMENT',
        link: '/employees/implement',
        parentId: 1
      },
      {
        id: 2,
        label: 'MENUITEMS.EMPLOYEES.LIST.EMPLOYEEIMPLEMENT',
        link: '/employees/employee-implement',
        parentId: 1
      },
      {
        id: 2,
        label: 'MENUITEMS.EMPLOYEES.LIST.EMPLOYEEATTENDANCE',
        link: '/employees/employee-attendance',
        parentId: 1
      },
      {
        id: 2,
        label: 'MENUITEMS.EMPLOYEES.LIST.EMPLOYEEDISCOUNT',
        link: '/employees/employee-discount',
        parentId: 1
      }
    ]
  },
  {
    id: 1,
    label: 'MENUITEMS.VEHICLES.TEXT',
    icon: 'bx-store',
    subItems: [
      {
        id: 2,
        label: 'MENUITEMS.VEHICLES.LIST.TRUCKFLEET',
        link: '/vehicles/truck-fleet',
        parentId: 1
      },
      {
        id: 3,
        label: 'MENUITEMS.VEHICLES.LIST.FUEL',
        link: '/vehicles/kardex-fuel',
        parentId: 1
      },
      {
        id: 4,
        label: 'MENUITEMS.VEHICLES.LIST.OIL',
        link: '/vehicles/maintenance-oil',
        parentId: 1
      },
      {
        id: 5,
        label: 'MENUITEMS.VEHICLES.LIST.TIRE',
        link: '/vehicles/maintenance-tire',
        parentId: 1
      }
    ]
  },
  {
    id: 2,
    label: 'MENUITEMS.CUSTOMERS.TEXT',
    icon: 'bx-store',
    subItems: [
      {
        id: 2,
        label: 'MENUITEMS.CUSTOMERS.LIST.ROUTES',
        link: '/customers/route',
        parentId: 1
      },
      {
        id: 2,
        label: 'MENUITEMS.CUSTOMERS.LIST.RATES',
        link: '/customers/rate',
        parentId: 1
      },
      {
        id: 2,
        label: 'MENUITEMS.CUSTOMERS.LIST.CUSTOMERS',
        link: '/customers/customer',
        parentId: 1
      },
      {
        id: 2,
        label: 'MENUITEMS.CUSTOMERS.LIST.CUSTOMERSEMPLOYEES',
        link: '/customers/customer-employees',
        parentId: 1
      }

    ]
  },
  {
    id: 1,
    label: 'MENUITEMS.SERVICES.TEXT',
    icon: 'bx-store',
    subItems: [
      {
        id: 2,
        label: 'MENUITEMS.SERVICES.LIST.EXPENSETYPE',
        link: '/services/expenseType',
        parentId: 1
      },
      {
        id: 2,
        label: 'MENUITEMS.SERVICES.LIST.SERVICEINCIDENTS',
        link: '/services/serviceIncidents',
        parentId: 1
      },
      {
        id: 2,
        label: 'MENUITEMS.SERVICES.LIST.SETTLEMENTSUMMARY',
        link: '/services/settlementSummary',
        parentId: 1
      }
    ]
  },
  {
    id: 1,
    label: 'MENUITEMS.PROVIDERS.TEXT',
    icon: 'bx-store',
    subItems: [
      {
        id: 2,
        label: 'MENUITEMS.PROVIDERS.LIST.PROVIDER',
        link: '/providers/providers',
        parentId: 1
      },
      {
        id: 2,
        label: 'MENUITEMS.PROVIDERS.LIST.PROVINCEESTIVATORS',
        link: '/providers/province-estivators',
        parentId: 1
      },
      {
        id: 2,
        label: 'MENUITEMS.PROVIDERS.LIST.TIREREPLACEMENT',
        link: '/providers/tire-replacement',
        parentId: 1
      },
      {
        id: 2,
        label: 'MENUITEMS.PROVIDERS.LIST.FUELSUPPLY',
        link: '/providers/fuel-supply',
        parentId: 1
      }
    ]
  }
];

