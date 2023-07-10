import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { UtilService } from 'src/app/services/util.service';
import firebase from 'firebase/compat/app';

@Component({
  selector: 'app-login-signup',
  templateUrl: './login-signup.component.html',
  styleUrls: ['./login-signup.component.scss'],
})
export class LoginSignupComponent implements OnInit {
  segment: string = 'login';
  signupForm: FormGroup;
  loginForm: FormGroup;
  constructor(public modalCtrl: ModalController,
    private util: UtilService,
    private api: ApiService,
    public auth: AuthService,
    private afAuth: AngularFireAuth

  ) {
    this.signupForm = new FormGroup({
      fullname: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
  }

  ngOnInit() { }

  close() {
    this.modalCtrl.dismiss();
  }

  get loginErrorControl() {
    return this.loginForm.controls;
  }

  get signupErrorControl() {
    return this.signupForm.controls;
  }

  signup() {
    this.util.showLoading();
    this.auth.signInWithEmailPassword(this.signupForm.value.email, this.signupForm.value.password, this.signupForm.value.fullname).then(res => {
      if (res.uid) {
        this.util.hideLoading();
        this.util.presentToast('Account created successfully!');
        this.segment = 'login';
      }
    }, err => {
      this.util.hideLoading();
      this.util.presentToast('Something went wrong!');
    })
  }

  login() {
    this.util.showLoading();
    this.afAuth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(() => {
      this.auth.login(this.loginForm.value.email, this.loginForm.value.password).then(res => {
        if (res.uid) {
          this.api.getLoginUsers(res.uid).then(user => {
            this.modalCtrl.dismiss('loggedin', 'confirm');
            //localStorage.setItem('loggedIn', res.uid);
            //localStorage.setItem('loggedInUser', JSON.stringify(user[0]));
            this.api.setUserDetails(user[0]);
            this.util.hideLoading();
          })
        }
      }, err => {
        this.util.hideLoading();
        this.util.presentToast('Something went wrong!');
      })
    }, err => {
      console.log(err);
      this.util.hideLoading();
      this.util.presentToast('Something went wrong!');
    })
  }
}
