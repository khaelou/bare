import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'today.tyme.Bare',
  appName: 'bare',
  webDir: 'dist',
  server: {
    allowNavigation: ['*'] // OR use Firebase-specific domains like 'firebaseio.com'
  },
  plugins: {
    CapacitorHttp: {
      enabled: true
    }
  },
  ios: {
    contentInset: 'always',
    allowsLinkPreview: true,
    scrollEnabled: true,
    limitsNavigationsToAppBoundDomains: false,
    handleApplicationNotifications: true,
  }
};

export default config;
