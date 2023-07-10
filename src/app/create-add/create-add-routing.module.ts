import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateAddPage } from './create-add.page';

const routes: Routes = [
  {
    path: '',
    component: CreateAddPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateAddPageRoutingModule {}
