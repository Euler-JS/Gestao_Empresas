import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DispesasPageRoutingModule } from './dispesas-routing.module';

import { DispesasPage } from './dispesas.page';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    DispesasPageRoutingModule
  ],
  declarations: [DispesasPage]
})
export class DispesasPageModule {}
