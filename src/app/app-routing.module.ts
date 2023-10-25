import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrudModule } from './crud/crud.module';

const routes: Routes = [
  {path: 'coupon-home', component: CrudModule}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
