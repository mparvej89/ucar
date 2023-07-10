import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ucar.sa',
  appName: 'U-care',
  webDir: 'www',
  bundledWebRuntime: false,
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
    },
  },
  cordova:{
    preferences:{
      LottieFullScreen:"true",
      LottieHideAfterAnimationEnd:"true",
      LottieAnimationLocation:"public/assets/splash.json",
    }
  }
  
};

export default config;
