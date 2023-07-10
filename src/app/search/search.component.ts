import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ModalController } from '@ionic/angular';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  brands: any = [];
  minPrice: number;
  maxPrice: number;
  brandId: any;
  mfdYear: any;
  kilomiter: any;
  constructor(public modalCtrl: ModalController,
    private db: AngularFirestore,
    public api: ApiService) { }

  ngOnInit() {
    this.getBrands();
  }

  close() {
    this.modalCtrl.dismiss();
  }

  getBrands() {
    this.brands = [];
    this.db.collection('brands').get().subscribe((res: any) => {
      res.forEach((element: any) => {
        let tempBrands = element.data();
        this.brands.push(tempBrands);
      });
    })
  }

  search() {
    this.api.searchAdds(this.brandId, this.kilomiter, this.minPrice, this.maxPrice, this.mfdYear).then(res => {
      console.log(res);

    })
  }

}
