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
  employees:{
    employee:{
      list: '/api-huex/v1/employees',
      retrieve: '/api-huex/v1/employees/',
      register: '/api-huex/v1/employees',
      update: '/api-huex/v1/employees',
      delete: '/api-huex/v1/employees/'
    }
  },
  customers:{
    route:{
      list: '/api-huex/v1/routes',
      retrieve: '/api-huex/v1/routes/',
      register: '/api-huex/v1/routes',
      update: '/api-huex/v1/routes',
      delete: '/api-huex/v1/routes/'
    },
    rate:{
      list: '/api-huex/v1/rates',
      retrieve: '/api-huex/v1/rates/',
      register: '/api-huex/v1/rates',
      update: '/api-huex/v1/rates',
      delete: '/api-huex/v1/rates/'
    }
  },
  services:{
    expenseType:{
      list: '/api-huex/v1/expenseType',
      retrieve: '/api-huex/v1/expenseType/',
      register: '/api-huex/v1/expenseType',
      update: '/api-huex/v1/expenseType',
      delete: '/api-huex/v1/expenseType/'
    },
    serviceIncidents:{
      list: '/api-huex/v1/serviceIncidents',
      retrieve: '/api-huex/v1/serviceIncidents/',
      register: '/api-huex/v1/serviceIncidents',
      update: '/api-huex/v1/serviceIncidents',
      delete: '/api-huex/v1/serviceIncidents/'
    },
    settlementSummary:{
      list: '/api-huex/v1/settlementSummary',
      retrieve: '/api-huex/v1/settlementSummary/',
      register: '/api-huex/v1/settlementSummary',
      update: '/api-huex/v1/settlementSummary',
      delete: '/api-huex/v1/settlementSummary/'
    }
  },

  vehicles:{
    truckfleet:{
      list: '/api-huex/v1/vehicle/truckFleet',
      retrieve: '/api-huex/v1/vehicle/truckFleet/',
      register: '/api-huex/v1/vehicle/truckFleet',
      update: '/api-huex/v1/vehicle/truckFleet',
      delete: '/api-huex/v1/vehicle/truckFleet/'
    }
  },
  providers:{
    provider:{
      list: '/api-huex/v1/provider',
      retrieve: '/api-huex/v1/provider/',
      register: '/api-huex/v1/provider',
      update: '/api-huex/v1/provider',
      delete: '/api-huex/v1/provider/'
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
