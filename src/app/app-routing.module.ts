import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'blogs',
    loadChildren: () => import('./modules/layout/layout.module').then(m => m.LayoutModule)
  },
  {
    path: "",
    pathMatch:"full",
    redirectTo:"blogs"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
