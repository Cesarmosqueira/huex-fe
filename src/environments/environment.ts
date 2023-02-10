// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  server: 'http://localhost:8080',
  production: false,
  defaultauth: 'fackbackend',
  firebaseConfig: {
    apiKey: '',
    authDomain: '',
    databaseURL: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
    measurementId: ''
  },
  employees: {
    employee: {
      list: '/v0.1/api-huex/v1/employees',
      retrieve: '/v0.1/api-huex/v1/employees/',
      register: '/v0.1/api-huex/v1/employees',
      update: '/v0.1/api-huex/v1/employees',
      delete: '/v0.1/api-huex/v1/employees/'
    },
    implement: {
      list: '/v0.1/api-huex/v1/implements',
      retrieve: '/v0.1/api-huex/v1/implements/',
      register: '/v0.1/api-huex/v1/implements',
      update: '/v0.1/api-huex/v1/implements',
      delete: '/v0.1/api-huex/v1/implements/'
    },
    employeeImplement: {
      list: '/v0.1/api-huex/v1/employee_implements',
      retrieve: '/v0.1/api-huex/v1/employee_implements/',
      register: '/v0.1/api-huex/v1/employee_implements',
      update: '/v0.1/api-huex/v1/employee_implements',
      delete: '/v0.1/api-huex/v1/employee_implements/'
    },
    employeeAttendance: {
      list: '/v0.1/api-huex/v1/attendances',
      retrieve: '/v0.1/api-huex/v1/attendances/',
      register: '/v0.1/api-huex/v1/attendances',
      update: '/v0.1/api-huex/v1/attendances',
      delete: '/v0.1/api-huex/v1/attendances/'
    },
    employeeDiscount: {
      list: '/v0.1/api-huex/v1/discounts',
      retrieve: '/v0.1/api-huex/v1/discounts/',
      register: '/v0.1/api-huex/v1/discounts',
      update: '/v0.1/api-huex/v1/discounts',
      delete: '/v0.1/api-huex/v1/discounts/'
    }
  },
  customers: {
    customer: {
      list: '/v0.1/api-huex/v1/customers',
      retrieve: '/v0.1/api-huex/v1/customers/',
      register: '/v0.1/api-huex/v1/customers',
      update: '/v0.1/api-huex/v1/customers',
      delete: '/v0.1/api-huex/v1/customers/'
    },
    route: {
      list: '/v0.1/api-huex/v1/routes',
      retrieve: '/v0.1/api-huex/v1/routes/',
      register: '/v0.1/api-huex/v1/routes',
      update: '/v0.1/api-huex/v1/routes',
      delete: '/v0.1/api-huex/v1/routes/'
    },
    rate: {
      list: '/v0.1/api-huex/v1/rates',
      retrieve: '/v0.1/api-huex/v1/rates/',
      register: '/v0.1/api-huex/v1/rates',
      update: '/v0.1/api-huex/v1/rates',
      delete: '/v0.1/api-huex/v1/rates/'
    },
    customerEmployees: {
      list: '/v0.1/api-huex/v1/customer_employee',
      retrieve: '/v0.1/api-huex/v1/customer_employee/',
      register: '/v0.1/api-huex/v1/customer_employee',
      update: '/v0.1/api-huex/v1/customer_employee',
      delete: '/v0.1/api-huex/v1/customer_employee/'
    }
  },
  services: {
    tracking: {
      list: '/v0.1/api-huex/v1/service/tracking',
      retrieve: '/v0.1/api-huex/v1/service/tracking/',
      register: '/v0.1/api-huex/v1/service/tracking',
      update: '/v0.1/api-huex/v1/service/tracking',
      delete: '/v0.1/api-huex/v1/service/tracking/'
    },
    expenseType: {
      list: '/v0.1/api-huex/v1/expense_type',
      retrieve: '/v0.1/api-huex/v1/expense_type/',
      register: '/v0.1/api-huex/v1/expense_type',
      update: '/v0.1/api-huex/v1/expense_type',
      delete: '/v0.1/api-huex/v1/expense_type/'
    },
    serviceIncidents: {
      list: '/v0.1/api-huex/v1/service_incident',
      retrieve: '/v0.1/api-huex/v1/service_incident/',
      register: '/v0.1/api-huex/v1/service_incident',
      update: '/v0.1/api-huex/v1/service_incident',
      delete: '/v0.1/api-huex/v1/service_incident/',
      listByIdTracking: '/v0.1/api-huex/v1/service_incident/tracking/'
    },
    settlementSummary: {
      list: '/v0.1/api-huex/v1/settlement_summary',
      retrieve: '/v0.1/api-huex/v1/settlement_summary/',
      register: '/v0.1/api-huex/v1/settlement_summary',
      update: '/v0.1/api-huex/v1/settlement_summary',
      delete: '/v0.1/api-huex/v1/settlement_summary/',
      listByIdTracking: '/v0.1/api-huex/v1/settlement_summary/tracking/',
    },
    serviceMonitoring: {
      list: '/v0.1/api-huex/v1/serviceMonitoring',
      retrieve: '/v0.1/api-huex/v1/serviceMonitoring/',
      register: '/v0.1/api-huex/v1/serviceMonitoring',
      update: '/v0.1/api-huex/v1/serviceMonitoring',
      delete: '/v0.1/api-huex/v1/serviceMonitoring/',
      listByIdTracking: '/v0.1/api-huex/v1/serviceMonitoring/tracking/'
    }
  },

  security:{
    user:{
      login: '/v0.1/api-huex/v1/security/user/login',
      register: '/v0.1/api-huex/v1/security/user',
      list: '/v0.1/api-huex/v1/security/user',
      delete: '/v0.1/api-huex/v1/security/user/',
    },
    menu:{
      list: '/v0.1/api-huex/v1/security/menu',
      listByUserId: '/v0.1/api-huex/v1/security/menu/'
    }
  },

  vehicles: {
    truckfleet: {
      list: '/v0.1/api-huex/v1/vehicle/truckFleet',
      retrieve: '/v0.1/api-huex/v1/vehicle/truckFleet/',
      register: '/v0.1/api-huex/v1/vehicle/truckFleet',
      update: '/v0.1/api-huex/v1/vehicle/truckFleet',
      delete: '/v0.1/api-huex/v1/vehicle/truckFleet/'
    },
    checkList: {
      list: '/v0.1/api-huex/v1/vehicle/checkList',
      retrieve: '/v0.1/api-huex/v1/vehicle/checkList/',
      register: '/v0.1/api-huex/v1/vehicle/checkList',
      update: '/v0.1/api-huex/v1/vehicle/checkList',
      delete: '/v0.1/api-huex/v1/vehicle/checkList/',
      listByIdTruckFleet: '/v0.1/api-huex/v1/vehicle/checkList/truckFleet/',
    },
    kardexFuel: {
      list: '/v0.1/api-huex/v1/vehicle/kardexFuel',
      retrieve: '/v0.1/api-huex/v1/vehicle/kardexFuel/',
      register: '/v0.1/api-huex/v1/vehicle/kardexFuel',
      update: '/v0.1/api-huex/v1/vehicle/kardexFuel',
      delete: '/v0.1/api-huex/v1/vehicle/kardexFuel/',
      listByIdTruckFleet: '/v0.1/api-huex/v1/vehicle/kardexFuel/truckFleet/',
    },
    maintenanceOil: {
      list: '/v0.1/api-huex/v1/vehicle/maintenanceOil',
      retrieve: '/v0.1/api-huex/v1/vehicle/maintenanceOil/',
      register: '/v0.1/api-huex/v1/vehicle/maintenanceOil',
      update: '/v0.1/api-huex/v1/vehicle/maintenanceOil',
      delete: '/v0.1/api-huex/v1/vehicle/maintenanceOil/',
      listByIdTruckFleet: '/v0.1/api-huex/v1/vehicle/maintenanceOil/truckFleet/',
    },
    maintenanceTire: {
      list: '/v0.1/api-huex/v1/vehicle/maintenanceTire',
      retrieve: '/v0.1/api-huex/v1/vehicle/maintenanceTire/',
      register: '/v0.1/api-huex/v1/vehicle/maintenanceTire',
      update: '/v0.1/api-huex/v1/vehicle/maintenanceTire',
      delete: '/v0.1/api-huex/v1/vehicle/maintenanceTire/',
      listByIdTruckFleet: '/v0.1/api-huex/v1/vehicle/maintenanceTire/truckFleet/',
    },
    documentUnit: {
      list: '/v0.1/api-huex/v1/vehicle/documentUnit',
      retrieve: '/v0.1/api-huex/v1/vehicle/documentUnit/',
      register: '/v0.1/api-huex/v1/vehicle/documentUnit',
      update: '/v0.1/api-huex/v1/vehicle/documentUnit',
      delete: '/v0.1/api-huex/v1/vehicle/documentUnit/',
      listByIdTruckFleet: '/v0.1/api-huex/v1/vehicle/documentUnit/truckFleet/',
    },
    fuel: {
      list: '/v0.1/api-huex/v1/vehicle/fuel',
      retrieve: '/v0.1/api-huex/v1/vehicle/fuel/',
      register: '/v0.1/api-huex/v1/vehicle/fuel',
      update: '/v0.1/api-huex/v1/vehicle/fuel',
      delete: '/v0.1/api-huex/v1/vehicle/fuel/',
      listByIdTruckFleet: '/api-huex/v1/vehicle/fuel/truckFleet/',
    }
  },
  providers: {
    provider: {
      list: '/v0.1/api-huex/v1/provider',
      retrieve: '/v0.1/api-huex/v1/provider/',
      register: '/v0.1/api-huex/v1/provider',
      update: '/v0.1/api-huex/v1/provider',
      delete: '/v0.1/api-huex/v1/provider/'
    },
    provinceEstivators: {
      list: '/v0.1/api-huex/v1/provinceEstivators',
      retrieve: '/v0.1/api-huex/v1/provinceEstivators/',
      register: '/v0.1/api-huex/v1/provinceEstivators',
      update: '/v0.1/api-huex/v1/provinceEstivators',
      delete: '/v0.1/api-huex/v1/provinceEstivators/'
    },
    tireReplacement: {
      list: '/v0.1/api-huex/v1/tireReplacement',
      retrieve: '/v0.1/api-huex/v1/tireReplacement/',
      register: '/v0.1/api-huex/v1/tireReplacement',
      update: '/v0.1/api-huex/v1/tireReplacement',
      delete: '/v0.1/api-huex/v1/tireReplacement/'
    },
    fuelSupply: {
      list: '/v0.1/api-huex/v1/fuelSupply',
      retrieve: '/v0.1/api-huex/v1/fuelSupply/',
      register: '/v0.1/api-huex/v1/fuelSupply',
      update: '/v0.1/api-huex/v1/fuelSupply',
      delete: '/v0.1/api-huex/v1/fuelSupply/'
    }
  }
};



/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
