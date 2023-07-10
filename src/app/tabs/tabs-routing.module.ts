import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'tab1',
        loadChildren: () => import('../tab1/tab1.module').then(m => m.Tab1PageModule)
      },
      {
        path: 'product-details',
        loadChildren: () => import('../product-details/product-details.module').then( m => m.ProductDetailsPageModule)
      },
      {
        path: 'create-add/:title',
        loadChildren: () => import('../create-add/create-add.module').then( m => m.CreateAddPageModule)
      },
      {
        path: 'my-adds',
        loadChildren: () => import('../my-adds/my-adds.module').then( m => m.MyAddsPageModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('../profile/profile.module').then( m => m.ProfilePageModule)
      },
      {
        path: 'support',
        loadChildren: () => import('../support/support.module').then( m => m.SupportPageModule)
      },
      {
        path: 'terms-condition',
        loadChildren: () => import('../terms-condition/terms-condition.module').then( m => m.TermsConditionPageModule)
      },
      {
        path: 'about-us',
        loadChildren: () => import('../about-us/about-us.module').then( m => m.AboutUsPageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/tab1',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/tab1',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
