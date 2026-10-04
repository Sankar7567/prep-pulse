import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'ai.preppulse.app',
  appName: 'PrepPulse AI',
  webDir: 'out',
  bundledWebRuntime: false,
  android: { backgroundColor: '#f7f8fc' },
  plugins: {
    LocalNotifications: { smallIcon: 'ic_stat_icon_config_sample', iconColor: '#635bff' }
  }
};
export default config;
