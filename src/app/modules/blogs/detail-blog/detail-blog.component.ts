import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlogService } from '@app/shared/services/blog.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-detail-blog',
    templateUrl: './detail-blog.component.html',
    styleUrls: ['./detail-blog.component.scss'],
})
export class DetailBlogComponent implements OnInit {
    idBlog!: string | number;
    $destroy: Subject<void> = new Subject<void>();
    isLoading = false;
    blog!: any;

    constructor(
        private route: ActivatedRoute,
        private blogService: BlogService,
    ) {
        this.route.paramMap.subscribe((params) => {
            this.idBlog = params.get('id') as string | number;
        });
    }

    ngOnInit(): void {
        this.isLoading = true;
        this.blogService
            .getDetailBlog(this.idBlog)
            .pipe(takeUntil(this.$destroy))
            .subscribe({
                next: (blog) => {
                 this.blog = blog;
                  this.isLoading = false;
                },
                error: (err: unknown) => {
                  console.log(err);
                  this.isLoading = false;
                }
            });
    }

    backToBlogs(){
        window.history.back();
    }

    ngOnDestroy(): void {
        this.$destroy.next();
        this.$destroy.complete();
    }
}
