import { Component, OnInit, ViewChild } from '@angular/core';
import { IonDatetime } from '@ionic/angular';
import { ExcelService } from 'src/app/services/excel.service';
import { OfflineDataService } from 'src/app/services/offline-data.service';
import { PdfExportService } from 'src/app/services/pdf-export.service';

@Component({
  selector: 'app-relatorios',
  templateUrl: './relatorios.page.html',
  styleUrls: ['./relatorios.page.scss'],
})
export class RelatoriosPage implements OnInit {
  public dateStartStatus: boolean = false;
  public dateEndStatus: boolean = false;
  public dateStatus: boolean = false;
  public dateType = "empty";
  typeSelectedReport = ""
  opcoesAvancadasCheck: boolean = false
  linhasDaTabela = []
  startD
  endD
  getInfo = []
  totalReport = 0
  rangeType
  mes_selecionado
  today_date = Date.now()
  showPicker = false;
  constructor(
    private offlineData: OfflineDataService,
    private generateExcel: ExcelService,
    private pdfReport: PdfExportService
  ) {
  }

  ngOnInit() {
    this.offlineData.getDataFromStorage('produtos')
    this.today_date = Date.now()
    console.log(this.today_date);

  }
  changeView(ev) {
    // this.typeSelectedReport = ev.detail.value
  }

  ionViewWillEnter(){
    this.typeSelectedReport = "produtos"
  }

  changeView1(ev) {
    this.typeSelectedReport = ev.detail.value
  }

  selecionarFinal(status) {
    this.dateStatus = false
    this.dateType = "empty"
  }
  selecionarStart(status) {
    this.dateStatus = !status
    this.dateType = "inicial"
  }

  selecionarEnd(status) {
    this.dateStatus = !status
    this.dateType = "final"
  }

  ionViewDidEnter() { }

  updateMyDateStart($event) {
    console.log($event); // --> wil contains $event.day.value, $event.month.value and $event.year.value
    this.startD = $event
    console.log("Start ", this.startD);


  }
  updateMyDateEnd($event) {
    console.log($event); // --> wil contains $event.day.value, $event.month.value and $event.year.value
    this.endD = $event
    console.log("End ", this.endD);

  }

  updateMonth(mes) {
    console.log(mes); // --> wil contains $event.day.value, $event.month.value and $event.year.value
    // this.endD = $event
    // console.log("End ", $event);
    this.mes_selecionado = mes.substring(0, 10).split('-')[1] - 1
    this.gerarRelatorio('selecionar_mes')

  }

  updateMyDate($event, type) {
    switch (type) {
      case "inicial":
        this.startD = $event
        this.dateStartStatus = true
        break;
      case "final":
        this.endD = $event
        this.dateEndStatus = true
        break;
      default:
        break;
    }
  }
  gerarRelatorio(rangeType) {
    if (this.typeSelectedReport.length > 2) {
      this.getInfo = []
      this.totalReport = 0
      this.linhasDaTabela = []
      this.rangeType = rangeType
      this.selectInfoArray().then(()=>
      {
        this.releasePDFReport()
      })
      // this.releaseXMLReport()
      
    }
    else {
      alert("Por favor selecione o tipo de Relatório")
    }
  }

  async selectInfoArray() {
    this.typeSelectedReport = "produtos"
    switch (this.typeSelectedReport) {
      case "ofertas":
        this.offlineData.ofertasArray.forEach(element => {
          this.gerarConteudo(element)
        });
        this.linhasDaTabela.push(['#', 'Valor', 'Tipo', 'Data'])
        break;
      case "dizimos":
        this.offlineData.dizimosArray.forEach(element => {
          this.gerarConteudo(element)
        });
        this.linhasDaTabela.push(['#', 'Valor', 'Dizimista', 'Tipo', 'Data'])
        break;
      case "produtos":
        this.offlineData.produtosArray.forEach(element => {
          this.gerarConteudo(element)
        });
        this.linhasDaTabela.push(['#', 'Preco', 'Nome', 'Tipo', 'Data'])
        break;

      case "dispesas_fixa":
        this.offlineData.produtosArray.forEach(element => {
          this.gerarConteudo(element)
        });
        this.linhasDaTabela.push(['#', 'Valor', 'Dispesa', 'Tipo', 'Data'])
        break;

      case "dispesas_nao_fixas":
        this.offlineData.dispesasNaoFixasArray.forEach(element => {
          this.gerarConteudo(element)
        });
        this.linhasDaTabela.push(['#', 'Valor', 'Dispesa', 'Tipo', 'Data'])
        break;
    }
    return
  }

  gerarConteudo(obj) {
    var today = new Date("" + obj.data);
    var from = new Date("" + this.startD).getTime()//new Date("01/01/2022").getTime();
    var to = new Date("" + this.endD).getTime()//new Date("25/01/2022").getTime();
    // var withinRange = today.getTime() >= from && today.getTime() <= to;
    var withinRange
    console.log(today.getMonth() - 1 == new Date().getMonth() - 1);
    
    switch (this.rangeType) {
      case 'actual':
        withinRange = today.getFullYear() == new Date().getFullYear() && today.getMonth() == new Date().getMonth()
        break;
      case 'passado':
        withinRange = today.getFullYear() == new Date().getFullYear() && today.getMonth() - 1 == new Date().getMonth() - 2
        console.log("Passado ", obj);
        
        break;
      case 'selecionar_mes':
        withinRange = today.getFullYear() == new Date().getFullYear() && today.getMonth() == this.mes_selecionado
        break;
      case 'aleatorio':
        withinRange = today.getTime() >= from && today.getTime() <= to
        break;
      default:
        console.log('Opcao invalida');
        

    }

    // console.log(today.getMonth(), today.getFullYear());
    // if(today.getFullYear() == new Date().getFullYear() && today.getMonth()-1 == new Date().getMonth()-1)
    // {
    //   obj['data'] = new Date("" + obj.data).toISOString().substring(0,10)
    //   this.getInfo.push(obj) 
    // }

    // if(today.getFullYear() == new Date().getFullYear() && today.getMonth() == new Date().getMonth())
    // {
    //   obj['data'] = new Date("" + obj.data).toISOString().substring(0,10)
    //   this.getInfo.push(obj) 
    // }
    if (withinRange) {
      obj['data'] = new Date("" + obj.data).toISOString().substring(0, 10)
      this.getInfo.push(obj)
      console.log(this.getInfo);
      this.totalReport = this.totalReport + parseFloat(obj.valor)
    }
  }

  releaseReport(data) {
    this.generateExcel.exportAsExcelFile(data, this.typeSelectedReport + "_" + this.startD + "_a_" + this.endD)
  }
  releaseXMLReport() {
    let typeSelectedReport = 'Excel Report'
    this.generateExcel.exportAsExcelFile(this.getInfo, typeSelectedReport)
  }

  releasePDFReport() {
    // console.log(Date.now());
    let dateP1; let dateP2;
    if (this.rangeType == 'aleatorio') {
      dateP1 = <HTMLInputElement>document.getElementById("myPicker1");
      dateP2 = <HTMLInputElement>document.getElementById("myPicker2");

      this.dateStartStatus = false
      this.dateEndStatus = false

      dateP1.value = null
      dateP2.value = null
    }
    if(this.getInfo.length >= 1) this.createPdf()
    else alert("Não existem registro de relatorios para o intervalo de tempo escolhido.")
  }

  createPdf()
  {
    // this.getInfo.push({"valor": this.totalReport})
    this.pdfReport.criarPDF("" + Date.now(), 1, this.getInfo, this.linhasDaTabela, this.typeSelectedReport)
  }

  relatorioMActual() {

  }

  relatorioMPassado() {

  }

  opcoesAvancadas(e) {
    if (e.currentTarget.checked) {
      this.opcoesAvancadasCheck = true
    } else {
      this.opcoesAvancadasCheck = false
    }
  }

  checkboxClick(e) {
    var statement = true;
    if (statement) {
      e.checked = true;
    }
  }

}
