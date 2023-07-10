import { Component, OnInit, ViewChild } from '@angular/core';
import { SwiperComponent } from 'swiper/angular';
import SwiperCore, { Autoplay, Keyboard, Pagination, Scrollbar, SwiperOptions, Zoom } from 'swiper';
import { ApiService } from '../services/api.service';
SwiperCore.use([Autoplay, Keyboard, Pagination, Scrollbar, Zoom]);

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.page.html',
  styleUrls: ['./product-details.page.scss'],
})
export class ProductDetailsPage implements OnInit {
  @ViewChild('swiper') swiper: SwiperComponent | undefined;
  config: SwiperOptions = {
    slidesPerView: 1,
    pagination: true,
    autoplay: true
  }
  addDetails: any;
  constructor(public api: ApiService) { }

  ngOnInit() {
    this.api.getAddDetails().subscribe(res => {
      if (res) {
        this.addDetails = res;
      }
    })
  }

  ngAfterContentChecked() {
    if (this.swiper) {
      this.swiper.updateSwiper({});
    }
  }
}
