import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UtilService } from '../services/util.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize, tap } from 'rxjs';
import { SwiperOptions } from 'swiper';
import { ApiService } from '../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ScreensizeService } from '../services/screensize.service';
import { ModalController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-create-add',
  templateUrl: './create-add.page.html',
  styleUrls: ['./create-add.page.scss'],
})
export class CreateAddPage implements OnInit {
  @Input() isEdit: boolean;
  title: string = '';
  createAddForm: any;
  countries: any[] = [];
  cities: any[] = [];
  selectedCountry: any;
  selectedCity: any;
  brands: any[] = [];
  models: any[] = [];
  images: any[] = [];
  updateImages: any[] = [];
  updateId: string = '';
  userDetails: any;
  config: SwiperOptions = {
    slidesPerView: 2.6,
    pagination: true,
    autoplay: false,
    spaceBetween: 6
  }
  vehicleTypes: any[] = [];
  isDesktop: boolean;
  year: any = new Date().getFullYear();
  constructor(private db: AngularFirestore,
    public util: UtilService,
    private storage: AngularFireStorage,
    private api: ApiService,
    private router: Router,
    private aroute: ActivatedRoute,
    private screensizeService: ScreensizeService,
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    private formBuilder: FormBuilder,
    public translate: TranslateService) {
    this.createAddForm = this.formBuilder.group({
      countryId: new FormControl('', [Validators.required]),
      cityId: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required]),
      brandId: new FormControl('', [Validators.required]),
      modelId: new FormControl('', [Validators.required]),
      year: new FormControl(this.year, [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{4}$")]),
      kilometer: new FormControl('', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]*$"), Validators.minLength(4), Validators.min(1000)]),
      price: new FormControl('', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]*$")]),
      phone: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(10), Validators.maxLength(10)]),
      about: new FormControl(''),
      type: new FormControl('', [Validators.required]),
    });

    this.screensizeService.isDesktopView().subscribe((isDesktop) => {
      this.isDesktop = isDesktop;
    });

  }

  ngOnInit() {
    this.title = this.aroute.snapshot.params.title;
    this.api.getUserDetails().subscribe(res => {
      if (res) {
        this.userDetails = res;
      }
    })

    this.db.collection('countries').valueChanges().subscribe(res => {
      if (res) {
        this.countries = res;
        if (this.translate.currentLang == 'ar') {
          this.countries.sort((a, b) => a.countryName.localeCompare(b.countryName));
        }
        else {
          this.countries.sort((a, b) => a.encountryName.localeCompare(b.encountryName));
        }

      }
    });

    this.db.collection('vehicle_type').valueChanges().subscribe(res => {
      if (res) {
        this.vehicleTypes = res;
      }
    })

    if (null == this.userDetails && !this.userDetails) {
      this.router.navigate(['./login']);
    }

  }
  ionViewWillEnter() {
    if (this.title == 'Edit' || this.isEdit) {
      this.updateAdd();
    }
  }

  selectCountry(event: any) {
    this.getCity(event.detail.value.id);
    this.selectedCountry = event.detail.value.id;
  }
  getCity(countryId: any) {
    this.cities = [];
    this.db.collection('cities', ref => ref.where("countryId", "==", countryId)).get().subscribe((res: any) => {
      res.forEach((element: any) => {
        let tempCity = element.data();
        this.cities.push(tempCity);
        if (this.translate.currentLang == 'ar') {
          this.cities.sort((a, b) => a.cityName.localeCompare(b.cityName))
        }
        else {
          this.cities.sort((a, b) => a.encityName.localeCompare(b.encityName))
        }

      });
    })
  }

  selectCity(event: any) {
    this.selectedCity = event.detail.value.id;
  }


  selectType(event: any) {
    this.getBrands(event.detail.value);
  }


  getBrands(type: any) {
    this.brands = [];
    this.db.collection('brands', ref => ref.where("vehicleType.id", "==", type.id)).get().subscribe((res: any) => {
      res.forEach((element: any) => {
        let tempBrands = element.data();
        this.brands.push(tempBrands);
        if (this.translate.currentLang == 'ar') {
          this.brands.sort((a, b) => a.brandName.localeCompare(b.brandName));
        }
        else {
          this.brands.sort((a, b) => a.enbrandName.localeCompare(b.enbrandName));
        }

      });
    })
  }

  selectBrand(event: any) {
    this.getModel(event.detail.value.id);
  }

  getModel(brandId: any) {
    this.models = [];
    this.db.collection('models', ref => ref.where("brandId", "==", brandId)).get().subscribe((res: any) => {
      res.forEach((element: any) => {
        let tempModel = element.data();
        this.models.push(tempModel);
        if (this.translate.currentLang == 'ar') {
          this.models.sort((a, b) => a.modelName.localeCompare(b.modelName));
        } else {
          this.models.sort((a, b) => a.enmodelName.localeCompare(b.enmodelName));
        }

      });
    })
  }

  createAdd() {
    this.util.showLoading();
    const promises: any[] = [];
    if (this.images.length >= 0) {
      this.images.forEach(ele => {
        if (ele.base64) {
          promises.push(this.uploadImage(ele));
        }

      })
      Promise.all(promises)
        .then((results) => {
          if (!this.isEdit || (this.title == 'Add' && this.updateId == '')) {
            let data: any;
            data = this.createAddForm.value;
            data.images = results;
            data.id = this.util.makeid(8);
            data.uid = this.userDetails.uid;
            data.creationDate = new Date().toISOString();
            data.status = "CREATED"
            this.api.createAdd(data).then(res => {
              if (res == 'success') {
                this.images = [];
                this.api.setAddDetails(null);
                this.createAddForm.reset();
                this.util.presentToast('Add created successfully!');
                this.util.hideLoading();
                this.navCtrl.back();
              }
            }, err => {
              this.router.navigate(['./login']);
            })
          }
          else {
            let data: any;
            data = this.createAddForm.value;
            data.images = [...results, ...this.updateImages];
            data.id = this.updateId;
            data.uid = this.userDetails.uid;
            data.creationDate = new Date().toISOString();
            this.api.updateAdd(data).then(res => {
              if (res == 'success') {
                this.images = [];
                this.api.setAddDetails(null);
                this.createAddForm.reset();
                this.util.presentToast('Add update successfully!');
                this.util.hideLoading();
                this.navCtrl.back();
              }
            }, err => {
              this.router.navigate(['./login']);
            })
          }


        })
        .catch((e) => {
          // Handle errors here
        });
    }
  }


  handleFileInput(files: any) {
    const file = files.target.files;
    if (this.images.length !== 5) {
      if (file.length) {
        const fileType = file[0].type;
        // File Size
        const fileSize = file[0].size;
        if (this.util.uploadFileValidation(fileType, fileSize)) {
          this.util.getBase64(file[0]).then(
            (res: any) => {
              const data = {
                name: file[0].name,
                base64: res.split(',')[1] ? res.split(',')[1] : '',
                preview: res
              };
              this.images.push(data);
            },
            (err) => { }
          );
        }
      }
    } else {
      this.util.presentToast('Can not upload more than 5 attachments. ');
    }
  }

  removeImage(i: any) {
    this.images.splice(i, 1);
    if (this.updateImages) {
      this.updateImages.splice(i, 1);
    }

  }

  uploadImage(value: any) {
    return new Promise((resolve, reject) => {
      this.storage.ref('/').child('product/' + value.name).putString(value.base64, 'base64').then((snapshot) => {
        snapshot.ref.getDownloadURL().then((url) => {
          resolve(url);
        });
      }).catch((err) => {
        reject('failed')
        console.log(err);
      });
    });
  }


  updateAdd() {
    this.images = [];
    this.api.getAddDetails().subscribe(res => {
      if (res) {

        console.log('res',res);
        
        this.updateId = res.id;
        this.createAddForm.patchValue({
          countryId: res.countryId,
          cityId: res.cityId,
          address: res.address,
          brandId: res.brandId,
          modelId: res.modelId,
          year: res.year,
          kilometer: res.kilometer,
          price: res.price,
          phone: res.phone,
          about: res.about,
          type: res.type
        });
        this.updateImages = res.images;
        this.updateImages.forEach(img => {
          let data = {
            preview: img
          }
          this.images.push(data);
        })


      }
    })
  }

  compareCountry(e1, e2): boolean { 
    return e1 && e2 ? e1.id == e2.id : e1 == e2;
  }
  compareCity(c1, c2): boolean {
    return c1 && c2 ? c1.id == c2.id : c1 == c2;
  }
  compareBrand(s1, s2): boolean {
    return s1 && s2 ? s1.id == s2.id : s1 == s2;
  }
  compareModel(s1, s2): boolean {
    return s1 && s2 ? s1.id == s2.id : s1 == s2;
  }

  close() {
    this.modalCtrl.dismiss();
  }

  back() {
    this.navCtrl.back();
  }

}
