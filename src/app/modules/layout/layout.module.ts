import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout.component';
import { LayoutRoutingModule } from './layout-routing.module';
import { SharedModule } from '@app/shared/shared.module';

@NgModule({
    declarations: [LayoutComponent],
    imports: [CommonModule, LayoutRoutingModule, SharedModule],
    exports: [LayoutComponent],
})
export class LayoutModule {}
