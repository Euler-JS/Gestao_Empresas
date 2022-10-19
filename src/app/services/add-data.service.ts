import { Injectable } from '@angular/core';
import { Storage } from '@capacitor/storage';

@Injectable({
  providedIn: 'root'
})
export class AddDataService {
  ofertasArray: any = []
  dizimosArray: any = []
  produtosArray: any = []
  dispesasNaoFixasArray: any = []
  lastKey: any
  totalEntradas = 0
  totalDispesas = 0
  totalStatus = 0

  totalOfertas = 0;
  totalDizimos = 0;
  totalprodutos = 0;
  totalDispezasFixas = 0;
  totalDispesasNaoFixas = 0;
  constructor() { }

  async addDataOnStorage(name, object) {
    await Storage.set({
      key: 'g_empresa_S_' + name,
      value: object,
    });

    switch (name) {
      case "ofertas":
        this.ofertasArray = JSON.parse(object);
        break;
      case "dizimos":
        this.dizimosArray = JSON.parse(object);
        break;

      case "produtos":
        this.produtosArray = JSON.parse(object);
        break;

      case "produtos":
        this.produtosArray = JSON.parse(object);
        break;

      case "dispesasNaoFixas":
        this.dispesasNaoFixasArray = JSON.parse(object);
        break;

      default:
        break;
    }

    this.getDataFromStorage(name)
  }

  async getDataFromStorage(name) {


    await Storage.get({ key: 'g_empresa_S_' + name }).then(res => {
          if (res.value == null) {
            this.produtosArray = []
          }
          else {
            let tempTotal = this.totalDispezasFixas
            this.totalDispezasFixas = 0
            this.produtosArray = JSON.parse(res.value);
            this.produtosArray.forEach(element => {
              this.totalDispezasFixas = this.totalDispezasFixas + parseFloat(""+element.preco*element.quantidade)
              
            });
            this.totalDispesas = this.totalDispesas + (this.totalDispezasFixas - tempTotal)
          }
      });
  }

  async keyNumber() {
    await Storage.get({ key: 'g_empresa_S_KEY' }).then(res => {
      console.log(JSON.parse(res.value));
      if (res.value == null) {
        this.lastKey = 0;
      }
      else {
        this.lastKey = parseInt(JSON.parse(res.value));
      }


    });
  }
}

