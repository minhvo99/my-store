import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoadingComponent } from './components/loading/loading.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { ToastComponent } from './components/toast/toast.component';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const declarations = [
  HeaderComponent,
  FooterComponent,
  LoadingComponent,
  ToastComponent,
];
const imports = [
  CommonModule,
  NgbToastModule,
  FormsModule,
  ReactiveFormsModule,
];

@NgModule({
  imports: [imports],
  declarations: [...declarations, ConfirmDialogComponent, ToastComponent],
  exports: [...imports, ...declarations],
})
export class SharedModule {}
