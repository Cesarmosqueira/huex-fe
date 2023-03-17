// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  server: 'http://localhost:8080',
  //server: 'http://localhost:8084',
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
      list: '/api-huex/v1/employees',
      retrieve: '/api-huex/v1/employees/',
      register: '/api-huex/v1/employees',
      update: '/api-huex/v1/employees',
      delete: '/api-huex/v1/employees/'
    },
    implement: {
      list: '/api-huex/v1/implements',
      retrieve: '/api-huex/v1/implements/',
      register: '/api-huex/v1/implements',
      update: '/api-huex/v1/implements',
      delete: '/api-huex/v1/implements/'
    },
    employeeImplement: {
      list: '/api-huex/v1/employee_implements',
      retrieve: '/api-huex/v1/employee_implements/',
      register: '/api-huex/v1/employee_implements',
      update: '/api-huex/v1/employee_implements',
      delete: '/api-huex/v1/employee_implements/'
    },
    employeeAttendance: {
      list: '/api-huex/v1/attendances',
      retrieve: '/api-huex/v1/attendances/',
      register: '/api-huex/v1/attendances',
      update: '/api-huex/v1/attendances',
      delete: '/api-huex/v1/attendances/'
    },
    employeeDiscount: {
      list: '/api-huex/v1/discounts',
      retrieve: '/api-huex/v1/discounts/',
      register: '/api-huex/v1/discounts',
      update: '/api-huex/v1/discounts',
      delete: '/api-huex/v1/discounts/'
    },
    providerDiscount: {
      list: '/api-huex/v1/provider_discounts',
      retrieve: '/api-huex/v1/provider_discounts/',
      register: '/api-huex/v1/provider_discounts',
      update: '/api-huex/v1/provider_discounts',
      delete: '/api-huex/v1/provider_discounts/'
    }
  },
  customers: {
    customer: {
      list: '/api-huex/v1/customers',
      retrieve: '/api-huex/v1/customers/',
      register: '/api-huex/v1/customers',
      update: '/api-huex/v1/customers',
      delete: '/api-huex/v1/customers/'
    },
    route: {
      list: '/api-huex/v1/routes',
      retrieve: '/api-huex/v1/routes/',
      register: '/api-huex/v1/routes',
      update: '/api-huex/v1/routes',
      delete: '/api-huex/v1/routes/'
    },
    rate: {
      list: '/api-huex/v1/rates',
      retrieve: '/api-huex/v1/rates/',
      register: '/api-huex/v1/rates',
      update: '/api-huex/v1/rates',
      delete: '/api-huex/v1/rates/'
    },
    customerEmployees: {
      list: '/api-huex/v1/customer_employee',
      retrieve: '/api-huex/v1/customer_employee/',
      register: '/api-huex/v1/customer_employee',
      update: '/api-huex/v1/customer_employee',
      delete: '/api-huex/v1/customer_employee/'
    }
  },
  services: {
    tracking: {
      list: '/api-huex/v1/service/tracking',
      retrieve: '/api-huex/v1/service/tracking/',
      register: '/api-huex/v1/service/tracking',
      update: '/api-huex/v1/service/tracking',
      delete: '/api-huex/v1/service/tracking/'
    },
    expenseType: {
      list: '/api-huex/v1/expense_type',
      retrieve: '/api-huex/v1/expense_type/',
      register: '/api-huex/v1/expense_type',
      update: '/api-huex/v1/expense_type',
      delete: '/api-huex/v1/expense_type/'
    },
    serviceIncidents: {
      list: '/api-huex/v1/service_incident',
      retrieve: '/api-huex/v1/service_incident/',
      register: '/api-huex/v1/service_incident',
      update: '/api-huex/v1/service_incident',
      delete: '/api-huex/v1/service_incident/',
      listByIdTracking: '/api-huex/v1/service_incident/tracking/'
    },
    settlementSummary: {
      list: '/api-huex/v1/settlement_summary',
      retrieve: '/api-huex/v1/settlement_summary/',
      register: '/api-huex/v1/settlement_summary',
      update: '/api-huex/v1/settlement_summary',
      delete: '/api-huex/v1/settlement_summary/',
      listByIdTracking: '/api-huex/v1/settlement_summary/tracking/',
    },
    serviceMonitoring: {
      list: '/api-huex/v1/serviceMonitoring',
      retrieve: '/api-huex/v1/serviceMonitoring/',
      register: '/api-huex/v1/serviceMonitoring',
      update: '/api-huex/v1/serviceMonitoring',
      delete: '/api-huex/v1/serviceMonitoring/',
      listByIdTracking: '/api-huex/v1/serviceMonitoring/tracking/'
    }
  },

  security:{
    user:{
      login: '/api-huex/v1/security/user/login',
      register: '/api-huex/v1/security/user',
      list: '/api-huex/v1/security/user',
      delete: '/api-huex/v1/security/user/',
    },
    menu:{
      list: '/api-huex/v1/security/menu',
      listByUserId: '/api-huex/v1/security/menu/'
    }
  },

  vehicles: {
    truckfleet: {
      list: '/api-huex/v1/vehicle/truckFleet',
      retrieve: '/api-huex/v1/vehicle/truckFleet/',
      register: '/api-huex/v1/vehicle/truckFleet',
      update: '/api-huex/v1/vehicle/truckFleet',
      delete: '/api-huex/v1/vehicle/truckFleet/'
    },
    checkList: {
      list: '/api-huex/v1/vehicle/checkList',
      retrieve: '/api-huex/v1/vehicle/checkList/',
      register: '/api-huex/v1/vehicle/checkList',
      update: '/api-huex/v1/vehicle/checkList',
      delete: '/api-huex/v1/vehicle/checkList/',
      listByIdTruckFleet: '/api-huex/v1/vehicle/checkList/truckFleet/',
    },
    kardexFuel: {
      list: '/api-huex/v1/vehicle/kardexFuel',
      retrieve: '/api-huex/v1/vehicle/kardexFuel/',
      register: '/api-huex/v1/vehicle/kardexFuel',
      update: '/api-huex/v1/vehicle/kardexFuel',
      delete: '/api-huex/v1/vehicle/kardexFuel/',
      listByIdTruckFleet: '/api-huex/v1/vehicle/kardexFuel/truckFleet/',
    },
    maintenanceOil: {
      list: '/api-huex/v1/vehicle/maintenanceOil',
      retrieve: '/api-huex/v1/vehicle/maintenanceOil/',
      register: '/api-huex/v1/vehicle/maintenanceOil',
      update: '/api-huex/v1/vehicle/maintenanceOil',
      delete: '/api-huex/v1/vehicle/maintenanceOil/',
      listByIdTruckFleet: '/api-huex/v1/vehicle/maintenanceOil/truckFleet/',
    },
    maintenanceTire: {
      list: '/api-huex/v1/vehicle/maintenanceTire',
      retrieve: '/api-huex/v1/vehicle/maintenanceTire/',
      register: '/api-huex/v1/vehicle/maintenanceTire',
      update: '/api-huex/v1/vehicle/maintenanceTire',
      delete: '/api-huex/v1/vehicle/maintenanceTire/',
      listByIdTruckFleet: '/api-huex/v1/vehicle/maintenanceTire/truckFleet/',
    },
    documentUnit: {
      list: '/api-huex/v1/vehicle/documentUnit',
      retrieve: '/api-huex/v1/vehicle/documentUnit/',
      register: '/api-huex/v1/vehicle/documentUnit',
      update: '/api-huex/v1/vehicle/documentUnit',
      delete: '/api-huex/v1/vehicle/documentUnit/',
      listByIdTruckFleet: '/api-huex/v1/vehicle/documentUnit/truckFleet/',
    },
    fuel: {
      list: '/api-huex/v1/vehicle/fuel',
      retrieve: '/api-huex/v1/vehicle/fuel/',
      register: '/api-huex/v1/vehicle/fuel',
      update: '/api-huex/v1/vehicle/fuel',
      delete: '/api-huex/v1/vehicle/fuel/',
      listByIdTruckFleet: '/api-huex/v1/vehicle/fuel/truckFleet/',
    },
    fuelControl: {
      list: '/api-huex/v1/fuel_control',
      retrieve: '/api-huex/v1/fuel_control/',
      register: '/api-huex/v1/fuel_control',
      update: '/api-huex/v1/fuel_control',
      delete: '/api-huex/v1/fuel_control/',
    }
  },
  providers: {
    provider: {
      list: '/api-huex/v1/provider',
      retrieve: '/api-huex/v1/provider/',
      register: '/api-huex/v1/provider',
      update: '/api-huex/v1/provider',
      delete: '/api-huex/v1/provider/'
    },
    provinceEstivators: {
      list: '/api-huex/v1/provinceEstivators',
      retrieve: '/api-huex/v1/provinceEstivators/',
      register: '/api-huex/v1/provinceEstivators',
      update: '/api-huex/v1/provinceEstivators',
      delete: '/api-huex/v1/provinceEstivators/'
    },
    tireReplacement: {
      list: '/api-huex/v1/tireReplacement',
      retrieve: '/api-huex/v1/tireReplacement/',
      register: '/api-huex/v1/tireReplacement',
      update: '/api-huex/v1/tireReplacement',
      delete: '/api-huex/v1/tireReplacement/'
    },
    fuelSupply: {
      list: '/api-huex/v1/fuelSupply',
      retrieve: '/api-huex/v1/fuelSupply/',
      register: '/api-huex/v1/fuelSupply',
      update: '/api-huex/v1/fuelSupply',
      delete: '/api-huex/v1/fuelSupply/'
    }
  },
  operationsCosts: {
    tolls: {
      list: '/api-huex/v1/tolls',
      retrieve: '/api-huex/v1/tolls/',
      register: '/api-huex/v1/tolls',
      update: '/api-huex/v1/tolls',
      delete: '/api-huex/v1/tolls/'
    },
    routeToll: {
      list: '/api-huex/v1/route_tolls',
      retrieve: '/api-huex/v1/route_tolls/',
      register: '/api-huex/v1/route_tolls',
      update: '/api-huex/v1/route_tolls',
      delete: '/api-huex/v1/route_tolls/'
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
