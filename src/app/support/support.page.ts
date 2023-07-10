import { Component, OnInit } from '@angular/core';
import { CallNumber } from '@awesome-cordova-plugins/call-number/ngx';

@Component({
  selector: 'app-support',
  templateUrl: './support.page.html',
  styleUrls: ['./support.page.scss'],
})
export class SupportPage implements OnInit {

  constructor(private callNumber: CallNumber) { }

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
