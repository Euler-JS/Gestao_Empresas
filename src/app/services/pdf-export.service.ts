import { Injectable } from '@angular/core';

import { File } from '@awesome-cordova-plugins/file/ngx';
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
// import { Storage } from '@ionic/storage';
// import { Membro } from '../models';
import { Platform, ToastController } from '@ionic/angular';
import { Device } from '@capacitor/device';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: 'root'
})
export class PdfExportService {
  // listaMembros: Membro[] = [];
  tirarDaLista: any = [];
  // membroRegistado: Membro;
  pdfObj = null;
  igreja: string;
  downloadBuffer: boolean = false;
  ptl
  constructor(
    private file: File,
    private fileOpener: FileOpener,
    private platform: Platform,
    private toastCtrl: ToastController
  ) {
    Device.getInfo().then(res => {
      this.ptl = res.platform
    })
  }

  // buscarMembrosDoCulto(culto) {
  //   this.listaMembros = [];
  //   this.tirarDaLista = [];
  //   this.storage.forEach((value: Membro, key, index) => {
  //     if (key.includes(culto.chave)) {
  //       console.log('esteve no culto ', culto.chave, key, value);
  //       this.listaMembros.push({
  //         nome: value.nome,
  //         bairro: value.bairro,
  //         telefone: value.telefone,
  //         celcius: value.celcius,
  //       });
  //       this.tirarDaLista.push(key);
  //     }
  //   }).then((res) => {
  //     if (this.listaMembros.length == 0) {
  //       console.log('ninguem esteve no culto... sair para home');
  //       this.storage.get('cultoIniciado').then(culto => {
  //         this.storage.set('ultimoCulto', [culto.chave, (culto.numero) - 1, culto.data]);
  //       });
  //     }
  //     else {
  //       console.log('criar-pdf chamado...')
  //       this.criarPDF(culto.data, culto.numero);
  //       this.toasterLog("Aguarde Enquanto Criamos o PDF", 3000, 'success');
  //     }
  //     this.storage.set('k_reg_pendentes', 0);
  //   });
  // }

  // buscarRegisto(culto) {
  //   this.storage.get(culto).then(res => {
  //     this.membroRegistado = res;
  //     console.log('membro buscado ', res);
  //   });
  // }


  criarPDF(dataCulto, numeroCulto, lista, linhasTabela, tipo) {
    numeroCulto = dataCulto
    var indice = 0;

    console.log("Lista ", lista, dataCulto);
    // return
    if (tipo == 'ofertas') {
      for (let item of lista) {
        indice++;
        linhasTabela.push([
          indice, item.valor, tipo, item.data
        ])
      }
    }
    else
    {
      for (let item of lista) {
        indice++;
        linhasTabela.push([
          indice, item.preco, item.nome, item.data
        ])
      }
    }

    console.log('lista: ', lista, 'tabela', linhasTabela);
    var docDefinition = {
      footer: {
        columns: [
          {
            text: 'Report : Gestor', alignment: 'right', fontSize: 9, margin: 20, italics: true,
            link: 'https://play.google.com/store/apps/details?id=com.equipmoz.kultuare', color: 'brown'
          },
        ]
      },
      content: [
        {
          text: this.igreja, alignment: 'center', margin: [0, 20, 0, 10], fontSize: 15, bold: true, color: 'brown'
        },
        {
          margin: 0, color: '#443d34',
          alignment: 'center',
          text: 'Report : Gestor' + '   -  ' + new Date().toISOString().substring(0,10) 
        },
        {
          margin: [0, 15, 0, 0],
          layout: 'lightHorizontalLines',
          table: {
            headerRows: 1,
            widths: [100, 100, 200, 150, 100],
            body: linhasTabela
          }
        }
      ]
    }

    if (indice > 0 && indice == lista.length) {
      this.pdfObj = pdfMake.createPdf(docDefinition);
      this.baixarPDF(dataCulto, numeroCulto);
    }
  }

  baixarPDF(dataCulto, numeroCulto) {

    if (this.ptl != 'web') {
      try {
        this.pdfObj.getBuffer((buffer) => {
          let utf8 = new Uint8Array(buffer);
          let binaryArray = utf8.buffer;
          let blob = new Blob([binaryArray], { type: 'application/pdf' });
          let fileName = 'gestor_' + dataCulto + '_' + numeroCulto + '.pdf';
          this.file.writeFile(this.file.externalDataDirectory, fileName, blob, { replace: true }).then(
            (fileEntry) => {
              // this.storage.set('k_lista_' + fileName, { file: fileName, path: this.file.externalDataDirectory + fileName }).then(pdf => {
              //   console.log('pdf saved on storage-list', pdf);
              // });
              this.fileOpener.open(this.file.externalDataDirectory + fileName, 'application/pdf');
              // this.removerListaDoCulto(this.tirarDaLista);
            },
            error => console.log('write-error ', error)
          );
        });
      } catch (error) {
        console.log("Erro");

      }

    }
    else {
      console.log('get-pdf-on-browser');
      setTimeout(() => {
        this.pdfObj.download();
      }, 1100);
    }
  }

  // removerListaDoCulto(lista) {
  //   console.log('remover essas keys da lista', lista);
  //   for (let chave of lista) {
  //     this.storage.remove(chave);
  //   }
  // }

  // async toasterLog(message, time, css) {
  //   const toast = await this.toastCtrl.create({
  //     message: message,
  //     duration: time,
  //     position: "middle",
  //     cssClass: 'toast' + css
  //   });
  //   toast.present();
  // }
}
