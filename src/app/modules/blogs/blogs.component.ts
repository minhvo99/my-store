import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmDialogComponent } from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import { BlogService } from '@app/shared/services/blog.service';
import { ToastService } from '@app/shared/services/toast.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, filter, switchMap, takeUntil } from 'rxjs';
import { EditBlogComponent } from './edit-blog/edit-blog.component';

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
    private modalService: NgbModal,
    private toastService: ToastService,
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

  onAddNewBlog() {}

  onEditBlog(blogItem: any) {
    const modalRef = this.modalService.open(EditBlogComponent);
    modalRef.componentInstance.title = 'Edit Blog';
    modalRef.componentInstance.blog = blogItem;

  }

  onDeleteBlog(blogId: string | number) {
    const modalRef = this.modalService.open(ConfirmDialogComponent);
    modalRef.componentInstance.title = 'Delete Blog';
    modalRef.componentInstance.message =
      'Are you sure you want to delete this blog?';
    modalRef.result
      .then((result: string) => {
        if (result === 'delete') {
          this.isLoading = true;
          this.blogService
            .deleteBlog(blogId)
            .pipe(
              switchMap(() => {
                return this.blogService.getBlogs(
                  this.currentPage,
                  this.itemsPerPage,
                );
              }),
              takeUntil(this.$destroy),
            )
            .subscribe({
              next: (blogs: any) => {
                this.blogs = blogs;
                this.isLoading = false;
              },
              error: (err: unknown) => {
                console.error(err);
                this.isLoading = false;
                this.toastService.show('Failed to delete blog!', {classname: 'bg-danger text-light'});
              },
              complete: () => {
                this.toastService.show(`Blog id ${blogId} deleted successfully !!!`, {
                  classname: 'bg-success text-light',
                });
              },
            });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  ngOnDestroy(): void {
    this.$destroy.next();
    this.$destroy.complete();
    this.toastService.clear();
  }
}
