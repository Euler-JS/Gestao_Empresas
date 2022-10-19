import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'dispesas',
    loadChildren: () => import('./dispesas/dispesas.module').then( m => m.DispesasPageModule)
  },
  {
    path: 'template',
    loadChildren: () => import('./template/template.module').then( m => m.TemplatePageModule)
  },
  {
    path: 'sobre',
    loadChildren: () => import('./paginas/sobre/sobre.module').then( m => m.SobrePageModule)
  }
  ,
  {
    path: 'relatorios',
    loadChildren: () => import('./paginas/relatorios/relatorios.module').then( m => m.RelatoriosPageModule)
  },

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
