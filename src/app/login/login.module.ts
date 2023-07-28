import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginPageRoutingModule } from './login-routing.module';

import { LoginPage } from './login.page';
import { LoginSignupComponent } from './login-signup/login-signup.component';
import { TranslateModule } from '@ngx-translate/core';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoginPageRoutingModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  declarations: [LoginPage,LoginSignupComponent, ResetPasswordComponent]
})
export class LoginPageModule {}
