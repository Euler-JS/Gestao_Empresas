import { Component,ViewChild } from '@angular/core';
import { AlertController,IonInfiniteScroll } from '@ionic/angular';
import { AddDataService } from '../services/add-data.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  @ViewChild(IonInfiniteScroll, { static: false }) infiniteScroll: IonInfiniteScroll;
  doacaoObject=
    {
      valor:'',
      nome:'',
      data:'',
      preco: '',
      quantidade: '',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      id_user: null
    };

    allprodutos: any;
    page = 1
  constructor(
    public alertController: AlertController,
    private addDataService: AddDataService
  ) {
    try {
      addDataService.getDataFromStorage('produtos');
    } catch (error) {
      console.log('Sem produtos registadas');

    }
  }

  ionViewDidEnter() {

    try {
      this.allprodutos = this.addDataService.produtosArray.slice(0,20);
      // this.allprodutos.reverse()
    } catch (error) {
      console.log('Array Vazio');

    }

  }

  addDoacao()
  {
    this.doacaoAlert();
  }

  async doacaoAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Registar Doações',
      inputs: [
        {
          name: 'nome',
          type: 'text',
          placeholder: 'Digite o nome do produto'
        },
        {
          name: 'preco',
          type: 'number',
          placeholder: 'Digite a preco'
        },
        {
          name: 'quantidade',
          type: 'number',
          placeholder: 'Digite a quantidade'
        },
        // {
        //   name: 'valor',
        //   type: 'number',
        //   placeholder: 'Digite o valor doado.'
        // }
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
            // this.doacaoObject.valor = val.doacao;
            this.doacaoObject.nome = val.nome;
            this.doacaoObject.preco = val.preco
            this.doacaoObject.quantidade = val.quantidade
            this.doacaoObject.data = (new Date()).toISOString();
            this.doacaoObject.id_user = 11;
            this.addDataService.produtosArray = [this.doacaoObject, ... this.addDataService.produtosArray];
            this.allprodutos = this.addDataService.produtosArray.slice(0, (20 * this.page) + 9)
            this.addDataService.addDataOnStorage('produtos',JSON.stringify(this.addDataService.produtosArray));
            console.log('Confirm Ok', val);
            // this.allprodutos = this.addDataService.produtosArray;
          }
        }
      ]
    });

    await alert.present();
  }

  loadMore(event) {
    setTimeout(() => {
      this.allprodutos = this.addDataService.produtosArray.slice(0, (20 * this.page) + 9)
      this.page++
      event.target.complete();
      if (this.addDataService.produtosArray.length == this.allprodutos.length) {
        event.target.disabled = true;
      }
    }, 200);
  }

}
