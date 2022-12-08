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
