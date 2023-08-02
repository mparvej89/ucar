import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { ApiService } from './services/api.service';
import { TranslateService } from '@ngx-translate/core';
import { UtilService } from './services/util.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { LottieSplashScreen } from '@awesome-cordova-plugins/lottie-splash-screen/ngx';
import { Platform } from '@ionic/angular';
import { ScreensizeService } from './services/screensize.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  user: any;
  public appPages = [];
  isDesktop: boolean;
  constructor(private router: Router,
    public auth: AuthService,
    private api: ApiService,
    public translate: TranslateService,
    private util: UtilService,
    private afAuth: AngularFireAuth,
    private db: AngularFirestore,
    private lottieSplashScreen: LottieSplashScreen,
    private platform: Platform,
    private screensizeService: ScreensizeService
  ) {
    this.screensizeService.isDesktopView().subscribe((isDesktop) => {
      this.isDesktop = isDesktop;
    });

    this.showSplash();
    translate.addLangs(Array.from(this.util.languages.keys()));
    if (this.util.languages.has(localStorage.getItem('language'))) {
      translate.use(localStorage.getItem('language'));
    } else {
      this.translate.use(this.translate.defaultLang);
      localStorage.setItem('language', this.translate.currentLang);
    }

    
  }
  @HostListener('window:resize', ['$event'])
  private onResize(event) {
    this.screensizeService.onResize(event.target.innerWidth);
  }

  async showSplash() {
    await this.platform.ready();
    if (this.platform.is('ios')) {
      await this.lottieSplashScreen.hide();
      await this.lottieSplashScreen.show("public/assets/splash.json", false);
    }
  }

  ngOnInit() {
    this.screensizeService.onResize(this.platform.width());
    this.api.getUserDetails().subscribe(res => {
      if (res) {
        this.user = res;
      }
    })
    this.getUserAuth();
  }
  getUserAuth() {
    this.afAuth.authState.subscribe(user => {
      if (null != user && user.uid) {
        const query = this.db.collection('users').doc(user.uid);
        query.ref.get().then((respone: any) => {
          if (respone.exists) {
            let userDetails = respone.data();
            this.api.setUserDetails(userDetails);
            this.appPages = [
              { title: 'side-bar-menu.profile', url: 'tabs/profile', icon: 'person-circle-outline' },
              { title: 'side-bar-menu.about', url: 'tabs/about-us', icon: 'information-circle-outline' },
              { title: 'side-bar-menu.My-Ads', url: 'tabs/my-adds', icon: 'image-outline' },
              { title: 'side-bar-menu.support', url: 'tabs/support', icon: 'headset-outline' },
              { title: 'side-bar-menu.Terms-Condition', url: 'tabs/terms-condition', icon: 'bulb-outline' },
              { title: 'side-bar-menu.Logout', url: 'logout', icon: 'log-in-outline' }
            ];
          }
        }, err => {
          console.log('err', err);
          this.api.setUserDetails(null);
        })
      } else {
        this.appPages = [
          { title: 'side-bar-menu.about', url: 'tabs/about-us', icon: 'information-circle-outline' },
          /* { title: 'side-bar-menu.profile', url: 'tabs/profile', icon: 'person-circle-outline' }, */
          { title: 'side-bar-menu.support', url: 'tabs/support', icon: 'headset-outline' },
          { title: 'side-bar-menu.Terms-Condition', url: 'tabs/terms-condition', icon: 'bulb-outline' },
          { title: 'side-bar-menu.Login-Signup', url: 'login', icon: 'log-in-outline' }
        ];
        this.api.setUserDetails(null);
      }
    });
  }

  route(url) {
    if (url == 'logout') {
      this.auth.logout().then(res => {
        this.api.setUserDetails(null);
        //window.location.reload();
      }, err => {
        console.log(err);
      });
    } else {
      this.router.navigate([url]);
    }
  }
}

