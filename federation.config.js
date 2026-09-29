const {
  withNativeFederation,
  shareAll,
} = require('@angular-architects/native-federation/config');

module.exports = withNativeFederation({
  name: 'patient',

  exposes: {
    './routes': './src/app/patient/patient.routes.ts',
  },

  /**
   * `shell/*` modules are provided by the shell at runtime via import map.
   * They are NOT npm packages, so Native Federation must treat them as
   * external shared dependencies and leave the import intact in the bundle.
   */
  shared: {
    ...shareAll({
      singleton: true,
      strictVersion: true,
      requiredVersion: 'auto',
    }),
    'shell/apiClient': {
      singleton: true,
      strictVersion: false,
      requiredVersion: false,
    },
    'shell/session': {
      singleton: true,
      strictVersion: false,
      requiredVersion: false,
    },
    'shell/apiError': {
      singleton: true,
      strictVersion: false,
      requiredVersion: false,
    },
  },

  skip: [
    'rxjs/ajax',
    'rxjs/fetch',
    'rxjs/testing',
    'rxjs/webSocket',
  ],
});