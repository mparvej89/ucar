import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateAddPageRoutingModule } from './create-add-routing.module';

import { CreateAddPage } from './create-add.page';
import { SwiperModule } from 'swiper/angular';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateAddPageRoutingModule,
    ReactiveFormsModule,
    SwiperModule,
    TranslateModule
  ],
  declarations: [CreateAddPage]
})
export class CreateAddPageModule {}
