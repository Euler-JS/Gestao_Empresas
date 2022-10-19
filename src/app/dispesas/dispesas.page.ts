import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AddDataService } from '../services/add-data.service';

@Component({
  selector: 'app-dispesas',
  templateUrl: './dispesas.page.html',
  styleUrls: ['./dispesas.page.scss'],
})
export class DispesasPage implements OnInit {

  viewFixa = true;
  lista: any
  lista2: any
  ver = []

  dispesaFixaObject =
    {
      valor: '',
      nome: '',
      data: '',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      id_user: null
    };

  dispesaNaoFixaObject =
    {
      valor: '',
      nome: '',
      data: '',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      id_user: null
    };
    page = 1
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
  pageFixa = 1
  pageNaoFixa = 1
  allDispesasNaoFixas: any;


  constructor(
    public alertController: AlertController,
    private addDataService: AddDataService
  ) {
    this.initDispesas()

  }


  ionViewDidEnter() {
    this.initArraysDispesas()
  }

  ngOnInit() {
  }

  changeView(ev) {
    switch (ev.detail.value) {
      case "fixa":
        this.viewFixa = true
        break;
      case "naoFixa":
        this.viewFixa = false
        break;
    }
  }

  dispesa() {
    this.produtoAlert(null)
  }

  getItems(ev) {
    let query = ev.target.value.toLowerCase()
    if (this.viewFixa) {
      this.procurarFixa(query)
    }
  }

  procurarFixa(query) {
    requestAnimationFrame(() => {
      this.ver = []
      let adicionados = []
      this.addDataService.produtosArray.forEach(x => {
        let list = x.search = x.nome + ' - '
          + ' ' + x.valor

        if (query.length > 0 && query.trim() != '') {
          let shouldShow = list.toLowerCase().indexOf(query) > -1;
          if(adicionados.find((element)=> element.nome == x.nome)) shouldShow = false
          else adicionados.push(x)
          this.ver.push(shouldShow)
        }
      });
    });
  }

  adicionarDispesa(nome) {
    // this.dispesaFixaAlert(nome)
    this.produtoAlert(nome)
  }

  initDispesas() {
    try {
      this.addDataService.getDataFromStorage('produtos');
    } catch (error) {
      console.log('Sem Dispesas Fixas registadas');
    }
  }

  initArraysDispesas() {
    try {
      this.allprodutos = this.addDataService.produtosArray.slice(0,20);
      // this.allprodutos.reverse()
    } catch (error) {
      console.log('Array Vazio');

    }
  }

  loadMoreFixa(event) {
    setTimeout(() => {
      this.allprodutos = this.addDataService.produtosArray.slice(0, (20 * this.pageFixa) + 9)
      this.pageFixa++
      event.target.complete();
      if (this.addDataService.produtosArray.length == this.allprodutos.length) {
        event.target.disabled = true;
      }
    }, 200);
  }

  
  async produtoAlert(value) {
    if(value == null){
      const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Registar Despesa',
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
            // this.produtoObject.valor = val.doacao;
            this.produtoObject.nome = val.nome;
            this.produtoObject.preco = val.preco
            this.produtoObject.quantidade = val.quantidade
            this.produtoObject.data = (new Date()).toISOString();
            this.produtoObject.id_user = 11;
            this.addDataService.produtosArray = [this.produtoObject, ... this.addDataService.produtosArray];
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
    else{
      this.addDespesaComNome(value)
    }
  }

  async addDespesaComNome(value)
  {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Registar Despesa',
      inputs: [
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
            // this.produtoObject.valor = val.doacao;
            this.produtoObject.nome = value;
            this.produtoObject.preco = val.preco
            this.produtoObject.quantidade = val.quantidade
            this.produtoObject.data = (new Date()).toISOString();
            this.produtoObject.id_user = 11;
            this.addDataService.produtosArray = [this.produtoObject, ... this.addDataService.produtosArray];
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
}
