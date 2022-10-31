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

    produtoObject=
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
      this.allprodutos = this.addDataService.produtosArray;
      // this.allprodutos = this.addDataService.produtosArray.slice(0,20);
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

  async editarRegistro(value)
  {
    let item = value
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Registar Despesa',
      inputs: [
        {
          name: 'nome',
          type: 'text',
          placeholder: 'Digite o nome',
          value: value.nome
        },
        {
          name: 'preco',
          type: 'number',
          placeholder: 'Digite a preco',
          value: value.preco
        },
        {
          name: 'quantidade',
          type: 'number',
          placeholder: 'Digite a quantidade',
          value: value.quantidade
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
            this.produtoObject.nome = val.nome;
            this.produtoObject.preco = val.preco
            this.produtoObject.quantidade = val.quantidade
            this.produtoObject.data = item.data;
            this.produtoObject.id_user = 11;
            this.addDataService.produtosArray[this.addDataService.produtosArray.indexOf(item)] = this.produtoObject
            this.addDataService.addDataOnStorage('produtos',JSON.stringify(this.addDataService.produtosArray));
          }
        }
      ]
    });

    await alert.present();
  }

  async apagarRegistro(id){
    this.addDataService.addDataOnStorage('produtos',JSON.stringify(this.addDataService.produtosArray.filter(registro=> registro.data != id)));
  }

}
