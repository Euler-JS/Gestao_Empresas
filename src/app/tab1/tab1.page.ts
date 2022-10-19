import { Component,ViewChild } from '@angular/core';
import { AlertController, IonInfiniteScroll } from '@ionic/angular';
import { AddDataService } from '../services/add-data.service';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})

// 
export class Tab1Page {
  @ViewChild(IonInfiniteScroll, { static: false }) infiniteScroll: IonInfiniteScroll;
  ofertaObject=
    {
      valor:'',
      data:'',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      id_user: null
    };

    novo: any = [];
    page = 1
    allOfertas: any = [];



  constructor(
    public alertController: AlertController,
    private addDataService: AddDataService) {
     
      


    }

    ionViewDidEnter() {
      try {
        // this.allOfertas = this.addDataService.ofertasArray;
        // this.allOfertas.reverse()
        // try {
        //   this.addDataService.getDataFromStorage('ofertas');
        // } catch (error) {
        //   console.log('Sem ofertas registadas');
  
        // }
        this.allOfertas = this.addDataService.ofertasArray.slice(0,30)
      } catch (error) {
        console.log('Array Vazio');

      }

      // console.log(this.allOfertas);


    }

    // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
    ngOnInit() {
      this.allOfertas.reverse()
      // this.apiService.getToken()
      // this.allOfertas = this.addDataService.getDataFromStorage("ofertas")
      // console.log(this.allOfertas);
    }

  addOferta()
  {
    this.ofertaAlert();
  }

  async ofertaAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Adiconar Oferta',
      inputs: [
        {
          name: 'oferta',
          type: 'number',
          placeholder: 'Digite o valor da Oferta'
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
            this.ofertaObject.valor = val.oferta;
            this.ofertaObject.data = (new Date()).toISOString();
            this.ofertaObject.id_user = 11;
            this.addDataService.ofertasArray = [this.ofertaObject, ... this.addDataService.ofertasArray];
            this.allOfertas = this.addDataService.ofertasArray.slice(0, (20 * this.page) + 9)
            // this.addDataService.ofertasArray.push(this.ofertaObject);
            // this.allOfertas.push(this.ofertaObject)
            // this.allOfertas.push(this.ofertaObject)
            // this.allOfertas = this.addDataService.ofertasArray.slice(0, (this.allOfertas.length +1 * this.page) + 9)
            // this.novo.push(this.ofertaObject)
            // novo.push(this.ofertaObject)

            // console.log("Dados ", this.ofertaObject[0]);

            this.addDataService.addDataOnStorage('ofertas',JSON.stringify(this.addDataService.ofertasArray));
            console.log('Confirm Ok', val);
            // this.allOfertas = this.addDataService.ofertasArray;
          }
        }
      ]
    });

    await alert.present();
  }

  loadMore(event) {
    setTimeout(() => {
      this.allOfertas = this.addDataService.ofertasArray.slice(0, (20 * this.page) + 9)
      this.page++
      event.target.complete();
      if (this.addDataService.ofertasArray.length == this.allOfertas.length) {
        event.target.disabled = true;
      }
    }, 200);
  }
}
