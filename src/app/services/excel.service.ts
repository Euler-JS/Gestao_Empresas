import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import * as JsonToXML from "js2xmlparser";
import { File } from '@awesome-cordova-plugins/file/ngx';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import { Device } from '@capacitor/device';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {
  ptl
  constructor(
    private file: File,
    private socialSharing: SocialSharing) {
    Device.getInfo().then(res => {
      this.ptl = res.platform
    })
   }

  static toExportFileName(excelFileName: string): string {
    return `${excelFileName}_export_${new Date().getTime()}.xlsx`;
  }

  //Funcao para exportar excel
  public exportAsExcelFile(json: any[], excelFileName: string): void {
    this.csvStringWork(json, 'country.csv', ',').then(res => {
      if (this.ptl == 'web') {
        this.downloadAll('g_empresa - report.xlsx', res)
      }
      else {
        this.shareFile('g_empresa - report.xlsx', res);
      }
    });
  }

  //Funcao para exportar csv
  async exportAsCSV(data) {
    var blob = await this.csvDownload(data, 'country.csv', ',')
    if (this.ptl == 'web') {
      this.downloadAll('country.csv', blob)
    }
    else {
      this.shareFile('country.csv', blob);
    }
  }

  //Funcao para exportar xml
  exportAsXML(data) {
    var blob = new Blob([JsonToXML.parse("country", data)], {
      type: 'text/xml'
    });
    if (this.ptl == 'web') {
      this.downloadAll('country_data.xml', blob)
    }
    else {
      this.shareFile('country_data.xml', blob);
    }
  }

  //Funcao para baixar ficheiros exportados
  shareFile(fileName: string, blob) {
    this.file.writeFile(this.file.dataDirectory, fileName, blob, { replace: true }).
      then(res => {
        console.log(res.nativeURL);
        this.socialSharing.share(null, null, res.nativeURL, null);
      })
  }

  //Funcao para pegar cabecalhos de CSV
  _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

  //Funcao para baixar CSV
  async csvDownload(data, name, delimiter) {
    var items = data;
    var filename = name || 'export.csv';
    var d = delimiter || ',';

    var header = Array.from(new Set(items.reduce((r, e) => {
      return [].concat(this._toConsumableArray(r), this._toConsumableArray(Object.keys(e)));
    }, [])));
    var csv = items.map((row) => {
      return header.map((fieldName: string) => {
        return JSON.stringify(row[fieldName] || '');
      }).join(d);
    });
    csv.unshift(header.join(d));
    csv = csv.join('\r\n');

    var blob = new Blob([csv], {
      type: 'text/plain;charset=utf-8'
    });

    return blob
  };

  //Funcao para retornar dados de CSV para criar ArrayBuffer
  csvStringWork(data, name, delimiter) {
    var items = data;
    var filename = name || 'export.csv';
    var d = delimiter || ',';

    var header = Array.from(new Set(items.reduce((r, e) => {
      return [].concat(this._toConsumableArray(r), this._toConsumableArray(Object.keys(e)));
    }, [])));
    var csv = items.map((row) => {
      return header.map((fieldName: string) => {
        return JSON.stringify(row[fieldName] || '');
      }).join(d);
    });
    csv.unshift(header.join(d));
    csv = csv.join('\r\n');
    return this.convertCsvToExcelBuffer(csv);
  }

  //Funcao para criar ArrayBUffer de CSV
  s2ab(s) {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  };

  //Funcao para converter CSV para Excel em formato de Buffer
  convertCsvToExcelBuffer(csvString: string) {
    const arrayOfArrayCsv = csvString.split("\n").map((row: string) => {
      return row.split(",")
    });
    const wb = XLSX.utils.book_new();
    const newWs = XLSX.utils.aoa_to_sheet(arrayOfArrayCsv);
    XLSX.utils.book_append_sheet(wb, newWs);
    const rawExcel = XLSX.write(wb, { type: 'base64' })
    return this.downloadExcelInBrowser(rawExcel);
  }

  //Funcao para retornar blob para dowbload do Excel
  async downloadExcelInBrowser(xlsxData) {
    const excelFileData = xlsxData;
    const decodedFileData = atob(excelFileData);
    const arrayBufferContent = this.s2ab(decodedFileData);
    const blob = new Blob([arrayBufferContent], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;' });
    return blob
  }

  //Download se estiver no navegador
  downloadAll(filename, blob) {
    var link = document.createElement('a');
    var url = URL.createObjectURL(blob);
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
