import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogsComponent } from './blogs.component';
import { SharedModule } from '@app/shared/shared.module';
import { BlogsRoutingModule } from './blogs-routing.module';
import { DetailBlogComponent } from './detail-blog/detail-blog.component';
import { AddBlogComponent } from './add-blog/add-blog.component';
import { EditBlogComponent } from './edit-blog/edit-blog.component';

@NgModule({
    declarations: [BlogsComponent, DetailBlogComponent, AddBlogComponent, EditBlogComponent],
    imports: [
        CommonModule,
        SharedModule,
        BlogsRoutingModule
    ],
    exports: [BlogsComponent]
})
export class BlogsModule { }