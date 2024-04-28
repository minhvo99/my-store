import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoadingComponent } from './components/loading/loading.component';

const declarations = [HeaderComponent, FooterComponent, LoadingComponent];
const imports = [CommonModule];

@NgModule({
    imports: [imports],
    declarations: [...declarations],
    exports: [...imports, ...declarations],
})
export class SharedModule {}
