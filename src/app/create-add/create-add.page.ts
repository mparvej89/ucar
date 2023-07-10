import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UtilService } from '../services/util.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize, tap } from 'rxjs';
import { SwiperOptions } from 'swiper';
import { ApiService } from '../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-create-add',
  templateUrl: './create-add.page.html',
  styleUrls: ['./create-add.page.scss'],
})
export class CreateAddPage implements OnInit {
  title: string = '';
  createAddForm: FormGroup;
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
  constructor(private db: AngularFirestore,
    public util: UtilService,
    private storage: AngularFireStorage,
    private api: ApiService,
    private router: Router,
    private aroute: ActivatedRoute) {
    this.createAddForm = new FormGroup({
      countryId: new FormControl('', [Validators.required]),
      cityId: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required]),
      brandId: new FormControl('', [Validators.required]),
      modelId: new FormControl('', [Validators.required]),
      year: new FormControl('', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{4}$")]),
      kilometer: new FormControl('', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]*$"), Validators.minLength(4), Validators.min(1000)]),
      price: new FormControl('', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]*$")]),
      phone: new FormControl('', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
      about: new FormControl(''),
      type: new FormControl('', [Validators.required]),
      /* name: new FormControl('', [Validators.required]) */
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
    if (this.title == 'Edit') {
      this.updateAdd();
    }
  }

  selectCountry(event: any) {
    this.getCity(event.detail.value.id);

    console.log(event.detail.value);

    this.selectedCountry = event.detail.value.id;
  }
  getCity(countryId: any) {
    this.cities = [];
    this.db.collection('cities', ref => ref.where("countryId", "==", countryId)).get().subscribe((res: any) => {
      res.forEach((element: any) => {
        let tempCity = element.data();
        this.cities.push(tempCity);
      });
    })
  }

  selectCity(event: any) {
    this.selectedCity = event.detail.value.id;
  }


  selectType(event: any) {
    console.log(event.detail.value);

    this.getBrands(event.detail.value);
  }


  getBrands(type: any) {
    this.brands = [];
    this.db.collection('brands', ref => ref.where("vehicleType", "==", type)).get().subscribe((res: any) => {
      res.forEach((element: any) => {
        let tempBrands = element.data();
        this.brands.push(tempBrands);
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
      });
    })
  }

  createAdd() {
    this.util.showLoading();
    const promises: any[] = [];
    if (this.images.length >= 0) {
      this.images.forEach(ele => {
        promises.push(this.uploadImage(ele));
      })
      Promise.all(promises)
        .then((results) => {
          if (this.title == 'Add' && this.updateId == '') {
            let data: any;
            data = this.createAddForm.value;
            data.images = results;
            data.id = this.util.makeid(8);
            data.uid = this.userDetails.uid;
            data.creationDate = new Date().toISOString();
            data.status = "CREATED"
            this.api.createAdd(data).then(res => {
              if (res == 'success') {
                this.util.hideLoading();
                this.api.setAddDetails(null);
                this.router.navigate(['./tabs/tab1']);
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
                this.util.hideLoading();
                this.api.setAddDetails(null);
                this.router.navigate(['./tabs/tab1']);
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
    this.api.getAddDetails().subscribe(res => {
      if (res) {
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



}
