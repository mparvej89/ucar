import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { LoginSignupComponent } from './login-signup/login-signup.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(public router: Router,
    public modalCtrl:ModalController,
    public translate: TranslateService) { }

  ngOnInit() {
  }

  home() {
    this.router.navigate(['./tabs']);
  }
  close(){
    this.router.navigate(['./tabs']);
  }
  async loginWithEmail(){
    const modal = await this.modalCtrl.create({
      component: LoginSignupComponent,
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm') {
      this.router.navigate(['./tabs']);
    }
  }

  termscondition(){
    this.router.navigate(['./terms-condition']);
  }

}
