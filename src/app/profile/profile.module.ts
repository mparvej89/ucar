import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfilePageRoutingModule } from './profile-routing.module';

import { ProfilePage } from './profile.page';
import { ImageUploadComponent } from '../image-upload/image-upload.component';
import { ImageCropperModule } from 'ngx-image-cropper';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfilePageRoutingModule,
    ReactiveFormsModule,
    ImageCropperModule
  ],
  entryComponents: [
    ImageUploadComponent
  ],
  declarations: [
    ProfilePage,
    ImageUploadComponent
  ]
})
export class ProfilePageModule {}
