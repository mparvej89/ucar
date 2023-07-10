import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { UtilService } from '../services/util.service';
import { AlertController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  personalInfoForm: FormGroup;
  userDetails: any;
  constructor(private api: ApiService,
    private auth: AuthService,
    private router: Router,
    private util: UtilService,
    private alertCtrl: AlertController,
    private fireAuth: AngularFireAuth,
  ) {
    this.personalInfoForm = new FormGroup({
      fullname: new FormControl(null, { validators: [Validators.required] }),
      email: new FormControl(null, { validators: [Validators.required] }),
      mobile: new FormControl(null, { validators: [Validators.required] }),
    });
  }

  ngOnInit() {
    this.api.getUserDetails().subscribe(res => {
      if (res) {
        console.log(res);
        this.userDetails = res;
        this.personalInfoForm.patchValue({
          fullname: res.fullname,
          email: res.email,
          mobile: res.mobile
        })

      }
    })
  }
  proceed() {
    this.util.showLoading();
    let user = this.personalInfoForm.value;
    user.uid = this.userDetails.uid;
    this.api.updateUser(user).then(res => {
      if (res == 'success') {
        this.util.hideLoading();
        this.util.presentToast("Update succesfully");
        this.api.setUserDetails(user);
      }
    }, err => {
      console.log(err);
      this.util.hideLoading();
      this.util.presentToast("Something went wrong");
    })
  }
  uploadProfileImage(event) {
    let items = {
      imageUrl: event,
      uid: this.userDetails.uid,
      imageType: 'PROFILE-IMAGE',
      type: 'UPDATE'
    }
    if (event) {
      this.auth.setImagesDataForUpload(items);
      this.router.navigate(['imageUpload']);
    }
  }

  async delete() {
    const alert = await this.alertCtrl.create({
      header: 'Are you sure want to delete account!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Yes',
          role: 'confirm',
        },
      ],
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    if (role == 'confirm') {
      this.api.deleteUser(this.userDetails);
      this.fireAuth.currentUser.then(user => user?.delete());
      this.api.setUserDetails(null);
      this.util.presentToast("Account deleted successfully");
      this.router.navigate(['./tabs/tab1']);
    }

  }
}
