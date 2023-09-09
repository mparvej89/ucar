import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  ForgotForm: FormGroup;
  constructor(private modalCtrl: ModalController,
    private authService: AuthService,
    private util: UtilService) {
    this.ForgotForm = new FormGroup({
      email: new FormControl('', [Validators.required])
    });
  }

  ngOnInit() { }


  close() {
    this.modalCtrl.dismiss();
  }
  forgotPass() {
    this.util.showLoading();
    this.authService.resetPassword(this.ForgotForm.value.email).then(res => {
      this.util.hideLoading();
      if (res == 'success') {
        this.util.presentToast('Reset Password link is sent to your email');
        this.modalCtrl.dismiss();
      }
    }, err => {
      this.util.hideLoading();
    })
  }

  open() {
    window.open('http://ucar.biz/', '_blank');
  }

}
