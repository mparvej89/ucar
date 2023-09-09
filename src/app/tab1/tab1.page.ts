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
import { ScreensizeService } from '../services/screensize.service';
import { SwiperComponent } from 'swiper/angular';
import SwiperCore, { Autoplay, Keyboard, Pagination, Scrollbar, SwiperOptions, Zoom } from 'swiper';
import { CreateAddPage } from '../create-add/create-add.page';
import { ProductDetailsPage } from '../product-details/product-details.page';
SwiperCore.use([Autoplay, Keyboard, Pagination, Scrollbar, Zoom]);
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  @ViewChild('swiper') swiper: SwiperComponent | undefined;
  config: SwiperOptions = {
    slidesPerView: 1,
    pagination: true,
    autoplay: true
  }
  selectedCountry: any;
  selectedCity: any;
  userId: any;
  adds: any[] = [];
  priceMinMax: boolean = false;
  filterCity: boolean = false;
  minPrice: any = 0;
  maxPrice: any = 10000;
  activebtn: string = 'ALL';
  recordsPerPage = 20;
  startAfterCursor: any;
  testList: any[] = [];
  endOfData = false;
  testSubscription: Subscription;
  @ViewChild('popover') popover;
  isOpen = false;
  @ViewChild(IonInfiniteScroll) infinite: IonInfiniteScroll;
  userDetails: any;
  isDesktop: boolean;
  slides: any[] = [{
    url: '../../assets/images/1.jpg'
  },
  {
    url: '../../assets/images/2.jpg'
  }, {
    url: '../../assets/images/3.jpg'
  }];
  brands: any[] = [];
  vehicleType: any[] = [];
  isOpenPopover: boolean = false;
  cities: any[] = [];
  cityId: any;
  constructor(public router: Router,
    public modalCtrl: ModalController,
    public api: ApiService,
    public util: UtilService,
    private db: AngularFirestore,
    public translate: TranslateService,
    private screensizeService: ScreensizeService) {
    this.screensizeService.isDesktopView().subscribe((isDesktop) => {
      this.isDesktop = isDesktop;
      if (this.isDesktop) {
        this.router.navigate(['./tab1']);
      }
      else {
        this.router.navigate(['./tabs/tab1'])
      }
    });

  }

  ngOnInit() {
    this.api.getUserDetails().subscribe(res => {
      if (res) {
        this.userDetails = res;
      }
      this.getVehicleType();

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
    this.adds = [];
    this.getMoreData(null);
    //this.getBrands();
    this.getCity()
  }

  async details(data: any) {
    this.api.setAddDetails(data);
    if (this.isDesktop) {
      const modal = await this.modalCtrl.create({
        component: ProductDetailsPage,
        cssClass: 'custom-modal-details'
      });
      modal.present();
    } else {
      this.router.navigate(['./tabs/product-details']);
    }


  }
  async countryCityModal() {
    const modal = await this.modalCtrl.create({
      component: CountryCityComponent,
      cssClass: 'custom-modal'
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      let country: any = localStorage.getItem('country')
      this.selectedCountry = JSON.parse(country);
      let city: any = localStorage.getItem('city');
      this.selectedCity = JSON.parse(city);
      this.getMoreData(null);
      this.getCity()
    }
  }

  async createAdd() {
    if (null != this.userDetails && this.userDetails.uid) {
      if (this.isDesktop) {
        const modal = await this.modalCtrl.create({
          component: CreateAddPage,
          cssClass: 'custom-modal'
        });
        modal.present();

        const { data, role } = await modal.onWillDismiss();
        if (role === 'CONFIRM') {
          //this.message = `Hello, ${data}!`;
        }
      }
      else {
        this.router.navigate(['./tabs/create-add/Add']);
      }

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
    this.filterCity = false;
  }

  cityFilter() {
    this.filterCity = !this.filterCity;
    this.priceMinMax = false;
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

  filterByCity() {
    let tempAdd: any[] = [];
    this.util.showLoading();
    this.api.getAdds(null).then(res => {
      if (res) {
        tempAdd = res;
        this.adds = tempAdd.filter((x) => {
          return x.cityId.id == this.cityId
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
    this.recordsPerPage = 20;
    this.startAfterCursor = '';
    this.infinite.disabled = true;
    this.getMoreData(null);
  }

  getMoreData(event: any) {
    this.testSubscription = this.api.getPaginatedData(this.recordsPerPage, this.startAfterCursor, this.activebtn, this.selectedCountry.id, this.selectedCity.id)
      .subscribe(result => {
        let resultData = (result.splice(0, this.recordsPerPage));
        if (this.activebtn != 'ALL') {
          resultData.forEach(element => {
            if (element.type.id == this.activebtn) {
              this.adds.push(element);
            }
          })
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

  getVehicleType() {
    this.db.collection('vehicle_type').get().subscribe((res: any) => {
      res.forEach((element: any) => {
        let vtype = element.data();
        this.vehicleType.push(vtype);
      });
    })
  }

  getTranslation(phrase: string) {
    let tns = this.translate.instant(phrase);
  }

  getCity() {
    this.cities = [];
    this.db.collection('cities', ref => ref.where("countryId", "==", this.selectedCountry.id)).get().subscribe((res: any) => {
      res.forEach((element: any) => {
        let tempCity = element.data();
        this.cities.push(tempCity);
        this.cities.sort((a, b) => a.cityName.localeCompare(b.cityName))
      });
    })
  }

}
