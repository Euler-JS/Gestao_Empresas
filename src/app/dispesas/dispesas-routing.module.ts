import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DispesasPage } from './dispesas.page';

const routes: Routes = [
  {
    path: '',
    component: DispesasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DispesasPageRoutingModule {}
