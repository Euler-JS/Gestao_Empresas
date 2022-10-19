import { Component, ViewChild } from '@angular/core';
import { AlertController, IonInfiniteScroll } from '@ionic/angular';
import { AddDataService } from '../services/add-data.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  @ViewChild(IonInfiniteScroll, { static: false }) infiniteScroll: IonInfiniteScroll;
  dizimoObject=
    {
      valor:'',
      nome:'',
      data:'',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      id_user: null
    };

  allDizimos: any;
  page = 1
  constructor(
    public alertController: AlertController,
    private addDataService: AddDataService
  ) {
    
  }

  ionViewDidEnter() {

    try {
      this.allDizimos = this.addDataService.dizimosArray.slice(0,20);
      // this.allDizimos.reverse()
    } catch (error) {
      console.log('Array Vazio');

    }

  }

  addDizimo()
  {
    this.dizimoAlert();
  }

  async dizimoAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Registar Dízimo',
      inputs: [
        {
          name: 'nome',
          type: 'text',
          placeholder: 'Digite o nome do Dizimista'
        },
        {
          name: 'dizimo',
          type: 'number',
          placeholder: 'Digite o valor do Dízimo'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (val) => {
            const now = new Date();
            console.log('Minha Data ',(new Date()).toISOString());
            this.dizimoObject.valor = val.dizimo;
            this.dizimoObject.nome = val.nome;
            this.dizimoObject.data = (new Date()).toISOString();
            this.dizimoObject.id_user = 11;
            this.addDataService.dizimosArray = [this.dizimoObject, ... this.addDataService.dizimosArray];
            this.allDizimos = this.addDataService.dizimosArray.slice(0, (20 * this.page) + 9)

            this.addDataService.addDataOnStorage('dizimos',JSON.stringify(this.addDataService.dizimosArray));
            console.log('Confirm Ok', val);
            // this.allDizimos = this.addDataService.dizimosArray;
          }
        }
      ]
    });

    await alert.present();
  }

  loadMore(event) {
    setTimeout(() => {
      this.allDizimos = this.addDataService.dizimosArray.slice(0, (20 * this.page) + 9)
      this.page++
      event.target.complete();
      if (this.addDataService.dizimosArray.length == this.allDizimos.length) {
        event.target.disabled = true;
      }
    }, 200);
  }

}
