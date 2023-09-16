import { Component, Input, OnInit } from '@angular/core';
import { CallNumber } from '@awesome-cordova-plugins/call-number/ngx';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-support',
  templateUrl: './support.page.html',
  styleUrls: ['./support.page.scss'],
})
export class SupportPage implements OnInit {
  @Input() isDesktop: boolean;
  constructor(private callNumber: CallNumber,
    public translate: TranslateService) { }

  ngOnInit() {
  }

  email() {
    window.open('mailto:' + 'info@u-car.biz');
  }
  call() {
    // await CallNumber.call({ number: '+966 55 507 0917', bypassAppChooser: false });
    this.callNumber.callNumber("+966 55 507 0917", true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));
  }

}
