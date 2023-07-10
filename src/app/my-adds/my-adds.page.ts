import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { UtilService } from '../services/util.service';
import { ActionSheetController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-adds',
  templateUrl: './my-adds.page.html',
  styleUrls: ['./my-adds.page.scss'],
})
export class MyAddsPage implements OnInit {
  adds: any[] = [];
  userDetails:any;
  constructor(public api: ApiService,
    public util: UtilService,
    private actionSheetCtrl: ActionSheetController,
    private db: AngularFirestore,
    public router: Router) { }

  ngOnInit() {
    this.api.getUserDetails().subscribe(res => {
      if (res) {
        this.userDetails = res;
      }
    })
    
  }
  ionViewWillEnter(){
    this.getAdds();
  }

  getAdds() {
    this.util.showLoading();
    this.db.collection('adds', ref => ref.where("uid", "==", this.userDetails.uid)).valueChanges().subscribe(adds => {
      if (adds) {
        this.adds = adds;
        this.util.hideLoading();
      }
    }, err => {
      this.util.hideLoading();
    });
  }

  async action(ad) {
    const actionSheet = await this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Delete',
          role: 'delete',
          data: {
            action: 'DELETE',
          },
        },
        {
          text: 'Edit',
          role: 'edit',
          data: {
            action: 'EDIT',
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
          data: {
            action: 'cancel',
          },
        },
      ],
    });

    await actionSheet.present();
    const result = await actionSheet.onDidDismiss();
    if (result.data.action == "DELETE") {
      this.api.deleteAdds(ad.id);
    }
    else if (result.data.action == "EDIT") {
      this.api.setAddDetails(ad);
      this.router.navigate(['./tabs/create-add/Edit']);
    }


  }

}
