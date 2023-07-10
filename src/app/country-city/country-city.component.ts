import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-country-city',
  templateUrl: './country-city.component.html',
  styleUrls: ['./country-city.component.scss'],
})
export class CountryCityComponent implements OnInit {
  countries: any[] = [];
  cities: any[] = [];
  selectedCountry: any;
  selectedCity: any;
  constructor(private modalCtrl: ModalController, private db: AngularFirestore) { }

  ngOnInit() {
    this.db.collection('countries').valueChanges().subscribe(res => {
      if (res) {
        this.countries = res;
      }
    })
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  selectedCountryAndCity() {
    localStorage.setItem('country', JSON.stringify(this.selectedCountry));
    localStorage.setItem('city', JSON.stringify(this.selectedCity));
    this.modalCtrl.dismiss('', 'confirm');
  }

  selectCountry(event: any) {
    this.getCity(event.detail.value.id);
    this.selectedCountry = event.detail.value;
  }

  selectCity(event: any) {
    this.selectedCity = event.detail.value;
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

}
