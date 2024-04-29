import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BlogService } from '@app/shared/services/blog.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-blogs',
    templateUrl: './blogs.component.html',
    styleUrls: ['./blogs.component.scss'],
})
export class BlogsComponent implements OnInit {
    blogs: any[] = [];
    currentPage = 1;
    itemsPerPage = 6;
    $destroy: Subject<void> = new Subject<void>();
    isLoading = false;
    totalPages!: number;

    constructor(
        private blogService: BlogService,
        private route: Router,
    ) {}

    ngOnInit(): void {
        this.getListBlogs();
        this.blogService.getTotalPages(this.itemsPerPage).subscribe({
            next: (totalPages: number) => {
                this.totalPages = totalPages;
            },
            error: (err: unknown) => {
                console.error(err);
            },
        });
    }

    getListBlogs() {
        this.isLoading = true;
        this.blogService
            .getBlogs(this.currentPage, this.itemsPerPage)
            .pipe(takeUntil(this.$destroy))
            .subscribe({
                next: (blogs: any) => {
                    this.blogs = blogs;
                    this.isLoading = false;
                },
                error: (err: unknown) => {
                    console.error(err);
                    this.isLoading = false;
                },
            });
    }
    nextPage() {
        if (this.currentPage === this.totalPages) {
            return;
        }
        this.currentPage++;
        this.getListBlogs();
    }

    prevPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.getListBlogs();
        }
    }

    viewDetailBlog(blogId: string | number) {
        this.route.navigate(['/blogs', blogId]);
    }
    ngOnDestroy(): void {
        this.$destroy.next();
        this.$destroy.complete();
    }
}
