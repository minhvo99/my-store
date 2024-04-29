import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogsComponent } from './blogs.component';
import { DetailBlogComponent } from './detail-blog/detail-blog.component';

const routes: Routes = [
    {
        path: '',
        component: BlogsComponent,
    },
    {
        path: ':id',
        component: DetailBlogComponent, 
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class BlogsRoutingModule {}
