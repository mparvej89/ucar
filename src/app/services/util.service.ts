import { Injectable } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
export const ALLOWED_ATTACHMENT_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
];
export const ALLOWED_FILE_SIZE = 10000000;
@Injectable({
  providedIn: 'root'
})
export class UtilService {
  private appLanguages: Map<string, any> = new Map([
    ['en', { text: 'English', code: 'en' }],
    ['ar', { text: 'Arabic', code: 'ar' }],
  ]);
  constructor(public loadingCtrl: LoadingController,
    private toastController: ToastController,
    private translate: TranslateService) { }

  async showLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...',
      spinner: 'circles',
      duration:5000
    });

    loading.present();
  }
  async hideLoading() {
    const loader = await this.loadingCtrl.getTop();
    if (loader)
      await loader.dismiss();
  }

  async presentToast(msg:string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      position: 'bottom'
    });

    await toast.present();
  }


  uploadFileValidation(fileType:any, fileSize:any) {
    const isImage = ALLOWED_ATTACHMENT_TYPES.filter(
      (type) => fileType.indexOf(`${type}`) !== -1
    );

    if (isImage.length !== 0) {
      if (fileSize <= ALLOWED_FILE_SIZE) {
        return true;
      } else {
        this.presentToast('Please Your File Should be 10 MB or Less');

        return false;
      }
    } else {
      this.presentToast(
        'Please make sure to upload valid Image'
      );
      return false;
    }
  }

  getBase64(file:any) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  makeid(length: any) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  get languages(): Map<string, any> {
    return this.appLanguages;
  }
}
