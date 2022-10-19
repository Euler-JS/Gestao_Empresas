import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { AddDataService } from './services/add-data.service';
import { StatusBar, StatusBarStyle, Style } from '@capacitor/status-bar';
import { MenuController } from '@ionic/angular';
import { SplashScreen } from '@capacitor/splash-screen'
import { OfflineDataService } from './services/offline-data.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  isStatusBarLight = true
  constructor(
    dataService: AddDataService,
    dataServiceOff: OfflineDataService,
    private menu: MenuController,
    public platform: Platform) {
    // StatusBar.setOverlaysWebView({ overlay: true });
    // StatusBar.setBackgroundColor({ color: 'var(--ion-color-primary-dark)' });
    // StatusBar.hide();

   


    platform.ready().then(preparado => {
      // StatusBar.setStyle({
      //   style: this.isStatusBarLight ? StatusBarStyle.Dark : StatusBarStyle.Light,
      // });
      // this.isStatusBarLight = !this.isStatusBarLight;
      // StatusBar.setOverlaysWebView({ overlay: true });

      dataServiceOff.loadData()
    try {
      dataService.getDataFromStorage("ofertas")
    } catch (error) {
      console.log("Ocorreu um erro ao pegar lista das ofertas");

    }

    try {
      dataService.getDataFromStorage("dizimos")
    } catch (error) {
      console.log("Ocorreu um erro ao pegar lista das dizimos");
    }

    try {
      dataService.getDataFromStorage("produtos")
    } catch (error) {
      console.log("Ocorreu um erro ao pegar lista das produtos");
    }

    try {
      dataService.getDataFromStorage("produtos")
    } catch (error) {
      console.log("Ocorreu um erro ao pegar lista das dispesas Fixas");
    }

    try {
      dataService.getDataFromStorage("dispesasNaoFixas")
    } catch (error) {
      console.log("Ocorreu um erro ao pegar lista das dispesas nao fixas");
    }

      this.iniciar()
    })
  }

  async iniciar() {
    await SplashScreen.show({
      showDuration: 5000,
      autoHide: true
    });

    if (this.platform.is('capacitor')) {
      
      StatusBar.setStyle({ style: Style.Light });

      // await StatusBar.show();
      // setTimeout(() => {
        StatusBar.setOverlaysWebView({ overlay: true });
      // }, 500);

    }
    console.log("Iniciando g_empresa");

  }

  openFirst() {
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }

  openEnd() {
    this.menu.open('end');
  }

  close()
  {
    this.menu.close()
  }

  openCustom() {
    this.menu.enable(true, 'custom');
    this.menu.open('custom');
  }
}
