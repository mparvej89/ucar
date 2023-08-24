import { Component, OnInit, ViewChild } from '@angular/core';
import { SwiperComponent } from 'swiper/angular';
import SwiperCore, { Autoplay, Keyboard, Pagination, Scrollbar, SwiperOptions, Zoom } from 'swiper';
import { ApiService } from '../services/api.service';
import { ScreensizeService } from '../services/screensize.service';
import { CallNumber } from '@awesome-cordova-plugins/call-number/ngx';
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
    autoplay: {
      delay: 3000
    }
  }
  addDetails: any;
  isDesktop: boolean = false;
  constructor(public api: ApiService,
    private screensizeService: ScreensizeService,
    private callNumber: CallNumber) {
    this.screensizeService.isDesktopView().subscribe((isDesktop) => {
      this.isDesktop = isDesktop;
    })

  }

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

  call(phone) {
    // await CallNumber.call({ number: '+966 55 507 0917', bypassAppChooser: false });
    this.callNumber.callNumber(phone, true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));
  }
}
