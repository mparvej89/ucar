import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ucar.sa',
  appName: 'U-CAR',
  webDir: 'www',
  bundledWebRuntime: false,
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      launchShowDuration: 0,
    },
  },
  cordova:{
    preferences:{
      LottieFadeOutDuration:"1",
      LottieFullScreen:"true",
      LottieHideAfterAnimationEnd:"true",
      LottieAnimationLocation:"public/assets/splash.json",
    }
  }
};

export default config;
