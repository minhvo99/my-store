import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmDialogComponent } from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import { BlogService } from '@app/shared/services/blog.service';
import { ToastService } from '@app/shared/services/toast.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  Subject,
  catchError,
  debounce,
  debounceTime,
  distinctUntilChanged,
  filter,
  of,
  switchMap,
  takeUntil,
  throwError,
} from 'rxjs';
import { EditBlogComponent } from './edit-blog/edit-blog.component';
import { AddBlogComponent } from './add-blog/add-blog.component';

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
  searchTeam!: any;

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

  onAddNewBlog() {
    const modalRef = this.modalService.open(AddBlogComponent);
    modalRef.componentInstance.title = 'Add New Blog';
    modalRef.result.then((result: string) => {
      if (result === 'created') {
        this.isLoading = true;
        const formData = modalRef.componentInstance.formAddBlog.value;
        const payload = new FormData();
        payload.append('title', JSON.stringify(formData.title));
        payload.append('content', JSON.stringify(formData.content));
        payload.append('image', JSON.stringify(formData.image));
        payload.append('createAt', new Date().toString());
        payload.append('body', JSON.stringify(formData.body));
        this.blogService
          .addNewBlog(payload)
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
            next: () => {
              this.isLoading = false;
              this.toastService.show('New blog created successfully !!!', {
                classname: 'bg-success text-light',
              });
            },
            error: (err: unknown) => {
              this.isLoading = false;
              this.toastService.show(
                `An error occurred: ${(err as any)?.message}`,
                { classname: 'bg-danger text-light' },
              );
            },
          });
      }
    });
  }

  onEditBlog(blogId: any) {
    const modalRef = this.modalService.open(EditBlogComponent);
    modalRef.componentInstance.title = 'Edit Blog';
    modalRef.componentInstance.id = blogId;
    modalRef.result.then((result: string) => {
      if (result === 'updated') {
        const formData = modalRef.componentInstance.formEdit.value;
        const payload = new FormData();
        payload.append('id', formData.id);
        payload.append('title', JSON.stringify(formData.title));
        payload.append('content', JSON.stringify(formData.content));
        payload.append('image', JSON.stringify(formData.image));
        payload.append('body', JSON.stringify(formData.body));
        this.isLoading = true;
        this.blogService
          .editBlog(blogId, payload)
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
            next: () => {
              this.isLoading = false;
              this.toastService.show(
                `Blog id ${formData.id} updated successfully !!!`,
                { classname: 'bg-success text-light' },
              );
            },
            error: (err: unknown) => {
              this.isLoading = false;
              this.toastService.show(
                `An error occurred: ${(err as any)?.message}`,
                { classname: 'bg-danger text-light' },
              );
            },
          });
      }
    });
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
                this.toastService.show('Failed to delete blog!', {
                  classname: 'bg-danger text-light',
                });
              },
              complete: () => {
                this.toastService.show(
                  `Blog id ${blogId} deleted successfully !!!`,
                  {
                    classname: 'bg-success text-light',
                  },
                );
              },
            });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  onSearch(searchTerm: string) {
    if (searchTerm.trim() === '') {
      this.getListBlogs();
      return;
    } else {
      this.blogService
        .searchBlog(searchTerm)
        .pipe(debounceTime(500))
        .subscribe({
          next: (blogs: any) => {
            this.blogs = blogs;
          },
          error: (err: unknown) => {
            this.blogs = [];
          },
        });
    }
  }

  ngOnDestroy(): void {
    this.$destroy.next();
    this.$destroy.complete();
    this.toastService.clear();
  }
}
