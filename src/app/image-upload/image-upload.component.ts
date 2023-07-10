import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage, AngularFireStorageReference } from '@angular/fire/compat/storage';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import firebase from 'firebase/compat/app';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { AuthService } from 'src/app/services/auth.service';
import { UtilService } from 'src/app/services/util.service';
import { ApiService } from '../services/api.service';


@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss'],
})
export class ImageUploadComponent implements OnInit {
  ref: AngularFireStorageReference;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  imageSelected: boolean = false;
  imagedataSubscribe: any;
  imageURL: string;
  userId: string;
  imageType: string;
  images: any[] = [];
  type: string;

  profileData: any;

  constructor(
    public router: Router,
    private storage: AngularFireStorage,
    private navCtrl: Location,
    private route: ActivatedRoute,
    public firestore: AngularFirestore,
    private modalController: ModalController,
    private auth: AuthService,
    private util: UtilService,
    private api: ApiService
  ) { }


  ngOnInit() {
    this.api.getUserDetails().subscribe(user => {
      if (user) {
        this.profileData = user;
      }
    })
    this.getImagesData();
  }

  getImagesData() {
    this.imagedataSubscribe = this.auth.getImagesDataForUpload().subscribe(data => {
      if (null != data) {
        this.imageChangedEvent = data.imageUrl;
        this.userId = data.uid;
        this.imageType = data.imageType;
        this.type = data.type;
        this.fileChangeEvent(this.imageChangedEvent);
        this.imageCropped(this.imageChangedEvent);
      }
    })

  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
    this.imageSelected = true;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;

  }

  cancel() {
    this.navCtrl.back();

  }

  saveUserImg() {
    this.util.showLoading();
    let encodeImg = this.croppedImage.split(',')[1];
    var cacheMetaData = {
      cacheControl: 'public,max-age=40000',
    }
    if (this.imageType == 'PROFILE-IMAGE') {
      this.ref = this.storage.ref('profile-image/' + this.userId);
      this.ref.putString(encodeImg, 'base64', cacheMetaData).then(data => {
        this.ref.getDownloadURL().subscribe(iurl => {
          this.saveUserProfileImg(iurl);
          this.util.hideLoading();
          this.navCtrl.back();
        });
      });
    }
  }

  saveUserProfileImg(imageURL) {
    if (this.type == 'UPDATE') {
      this.firestore.collection('users').doc(this.userId).update({
        imageUrl: imageURL
      });
    }
    this.profileData.imageUrl = imageURL;
    this.api.setUserDetails(this.profileData);
  }
  goBack() {
    this.navCtrl.back();
  }
}
