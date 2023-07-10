import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { SearchComponent } from '../search/search.component';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  userDetails: any;
  constructor(public router: Router, 
    public api: ApiService,
    public modalCtrl: ModalController) {

  }

  createAdd() {
    this.api.getUserDetails().subscribe(res => {
      if (res) {
        this.userDetails = res;
      }
    }) 
    if (null != this.userDetails && this.userDetails.uid) {
      this.router.navigate(['./tabs/create-add/Add']);
    } else {
      this.router.navigate(['./login']);
    }

  }
  async search() {
    const modal = await this.modalCtrl.create({
      component: SearchComponent,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      //this.message = `Hello, ${data}!`;
    }
  }
}
