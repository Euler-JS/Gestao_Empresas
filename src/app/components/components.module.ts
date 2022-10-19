import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { InfoComponent } from '../componentes/info/info.component';



@NgModule({
  declarations: [InfoComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports:[
    InfoComponent
  ]
})
export class ComponentsModule { }
