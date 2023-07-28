import { AfterContentChecked, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonInfiniteScroll, ModalController } from '@ionic/angular';
import { SearchComponent } from '../search/search.component';
import { CountryCityComponent } from '../country-city/country-city.component';
import { ApiService } from '../services/api.service';
import { UtilService } from '../services/util.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  selectedCountry: any;
  selectedCity: any;
  userId: any;
  adds: any[] = [];
  priceMinMax: boolean = false;
  minPrice: any = 0;
  maxPrice: any = 10000;
  activebtn: string = 'ALL';
  recordsPerPage = 4;
  startAfterCursor: any;
  testList: any[] = [];
  endOfData = false;
  testSubscription: Subscription;
  @ViewChild('popover') popover;
  isOpen = false;
  @ViewChild(IonInfiniteScroll) infinite: IonInfiniteScroll;
  userDetails: any;
  constructor(public router: Router,
    public modalCtrl: ModalController,
    public api: ApiService,
    public util: UtilService,
    private db: AngularFirestore,
    public translate: TranslateService) { }

  ngOnInit() {
    this.api.getUserDetails().subscribe(res => {
      if (res) {
        this.userDetails = res;
      }
    })


    let country: any = localStorage.getItem('country')
    this.selectedCountry = JSON.parse(country);
    let city: any = localStorage.getItem('city');
    this.selectedCity = JSON.parse(city);
    if (this.selectedCountry == null && this.selectedCity == null) {
      this.countryCityModal();
    }
  }
  ionViewWillEnter() {
    /* this.userId = localStorage.getItem('loggedIn'); */
    // this.getAdds();
    this.adds = [];
    this.getMoreData(null);
  }

  details(data: any) {
    this.api.setAddDetails(data);
    this.router.navigate(['./tabs/product-details']);
  }
  async countryCityModal() {
    const modal = await this.modalCtrl.create({
      component: CountryCityComponent,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      let country: any = localStorage.getItem('country')
      this.selectedCountry = JSON.parse(country);
      let city: any = localStorage.getItem('city');
      this.selectedCity = JSON.parse(city);
    }
  }

  createAdd() {
    if (null != this.userDetails && this.userDetails.uid) {
      this.router.navigate(['./tabs/create-add/Add']);
    } else {
      this.router.navigate(['./login']);
    }
  }

  getAdds() {
    this.util.showLoading();
    this.api.getAdds(null).then(res => {
      if (res) {
        this.adds = res;
        this.util.hideLoading();
      }
    }, err => {
      this.util.hideLoading();
    })
  }

  newToOld(data: any) {
    if (data == 'PRICLOWTOHIGH') {
      this.adds.sort((a, b) => {
        return a.price - b.price
      });
    }
    if (data == 'PRICEHIGHTOLOW') {
      this.adds.sort((a, b) => {
        return b.price - a.price;
      });
    }
    if (data == 'MILAGEHGH') {
      this.adds.sort((a, b) => {
        return b.kilometer - a.kilometer;
      });
    }
    if (data == 'MILAGELOW') {
      this.adds.sort((a, b) => {
        return a.kilometer - b.kilometer;
      });
    }
    if (data == 'NEWEST') {
      this.adds.sort((a, b) => {
        return b.year - a.year;
      });
    }
    if (data == 'OLDEST') {
      this.adds.sort((a, b) => {
        return a.year - b.year;
      });
    }
    if (data == 'NEWTOOLD') {
      this.adds.sort((a, b) => {
        return Number(new Date(b.creationDate)) - Number(new Date(a.creationDate));
      });
    }
    if (data == 'OLDTONEW') {
      this.adds.sort((a, b) => {
        return Number(new Date(a.creationDate)) - Number(new Date(b.creationDate));
      });
    }
    this.modalCtrl.dismiss();
  }

  minmax() {
    this.priceMinMax = !this.priceMinMax;
  }

  seeList() {
    let tempAdd: any[] = [];
    this.util.showLoading();
    this.api.getAdds(null).then(res => {
      if (res) {
        tempAdd = res;
        this.adds = tempAdd.filter((x) => {
          return x.price >= Number(this.minPrice) && x.price <= Number(this.maxPrice)
        });
        this.util.hideLoading();
      }
    }, err => {
      this.util.hideLoading();
    });
    this.modalCtrl.dismiss();

  }

  addtype(type?: string) {
    this.adds = [];
    this.activebtn = type;
    this.recordsPerPage = 6;
    this.startAfterCursor = '';
    this.infinite.disabled = true;
    this.getMoreData(null);
  }

  getMoreData(event: any) {
    this.testSubscription = this.api.getPaginatedData(this.recordsPerPage, this.startAfterCursor, this.activebtn)
      .subscribe(result => {
        let resultData = (result.splice(0, this.recordsPerPage));
        if (this.activebtn!='ALL') {
          this.adds = resultData.filter(res => res?.type?.vehicleType.toLowerCase() == this.activebtn.toLowerCase());
        }
        else {
          this.adds = resultData;
        }
        if (this.recordsPerPage > result.length) {
          this.endOfData = true;
          this.infinite.disabled = true;
        } else {
          this.endOfData = false;
          this.infinite.disabled = false;
        }

        // for next call, save last firestore doc info from the result
        if (result[this.recordsPerPage - 1] !== undefined) {
          this.startAfterCursor = result[this.recordsPerPage - 1].doc;
        }
      });

    if (event) {
      event.target.complete();
    }
  }
  changeLanguage(lang) {
    localStorage.setItem('language', lang);
    this.translate.use(lang);
    this.isOpen = false;
  }
  presentPopover(e: Event) {
    this.popover.event = e;
    this.isOpen = true;
  }
}
