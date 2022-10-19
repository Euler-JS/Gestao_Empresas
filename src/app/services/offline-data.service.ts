import { Injectable } from '@angular/core';
import { Storage } from '@capacitor/storage';

@Injectable({
  providedIn: 'root'
})
export class OfflineDataService {
  ofertasArray: any = []
  dizimosArray: any = []
  produtosArray: any = []
  dispesasNaoFixasArray: any = []
  lastKey: any
  anoActual = (new Date().getFullYear());
  tempData = [0,0,0,0,0,0,0,0,0,0,0,0]
  constructor() {
   }

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
  }

  async getDataFromStorage(name) {


    await Storage.get({ key: 'g_empresa_S_' + name }).then(res => {
      
          if (res.value == null) {
            this.produtosArray = []
          }
          else {
            this.produtosArray = JSON.parse(res.value);
            this.getMonthTotal(this.produtosArray)
          }
      })
    
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

  async getMonthTotal(data)
  {
    data.forEach(element => {
      let tempPosition = element.data.split(":")[0].split("-")[1]
      let dataInfo = {
        "dia" : parseInt(element.data.split(":")[0].split("-")[2]),
        "mes" : parseInt(element.data.split(":")[0].split("-")[1]) - 1,
        "ano" : parseInt(element.data.split(":")[0].split("-")[0])
      }
      
      if(dataInfo.ano == this.anoActual)
      {
        console.log(element.quantidade,element.preco, element.quantidade*element.preco);
        
        this.tempData[dataInfo.mes] = this.tempData[dataInfo.mes] + parseFloat(""+element.preco*element.quantidade)
      }
      // else
      // {
      //   this.tempData[dataInfo.mes] = 0 + parseFloat(element.valor)
      // }
         
    });
  }

  loadData()
  {
    this.tempData = [0,0,0,0,0,0,0,0,0,0,0,0]
    try {
      this.getDataFromStorage("ofertas")
      } catch (error) {
        console.log("Ocorreu um erro ao pegar lista das ofertas");
        
      }

      try {
        this.getDataFromStorage("dizimos") 
      } catch (error) {
        console.log("Ocorreu um erro ao pegar lista das dizimos");
      }

      try {
        this.getDataFromStorage("produtos")
      } catch (error) {
        console.log("Ocorreu um erro ao pegar lista das produtos");
      }

      try {
        this.getDataFromStorage("produtos")
      } catch (error) {
        console.log("Ocorreu um erro ao pegar lista das dispesas Fixas");
      }

      try {
        this.getDataFromStorage("dispesasNaoFixas")
      } catch (error) {
        console.log("Ocorreu um erro ao pegar lista das dispesas nao fixas");
      }
    
  }
}
