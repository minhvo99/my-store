import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BlogService } from '@app/shared/services/blog.service';
import { ToastService } from '@app/shared/services/toast.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-edit-blog',
  templateUrl: './edit-blog.component.html',
  styleUrls: ['./edit-blog.component.scss'],
})
export class EditBlogComponent implements OnInit {
  @Input() title!: string;
  @Input() message!: string;
  @Input() id!: string | number;
  formEdit!: FormGroup;
  blog!: any;
  isLoading = false;
  $destroy: Subject<void> = new Subject<void>();

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private blogService: BlogService,
    private toastService: ToastService,
  ) {
    this.formEdit = this.fb.group({
      id: [''],
      title: ['', Validators.required],
      content: ['', Validators.required],
      image: ['', Validators.required],
      body: this.fb.group({
        titleBody: ['', Validators.required],
        imageBody: ['', Validators.required],
        contentBody: ['', Validators.required],
      }),
    });
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.getBlogById(this.id).subscribe({
      next: (blog: any) => {
        this.blog = blog;
        this.isLoading = false;
      },
      error: (err: unknown) => {
        this.isLoading = false;
        this.toastService.show(`An error occurred: ${(err as any)?.message}`, {
          classname: 'bg-danger text-light',
        });
      },
      complete: () => {
        this.formEdit.patchValue({
          id: this.blog.id,
          title: this.blog.title,
          content: this.blog.content,
          image: this.blog.image,
          body: {
            titleBody: this.blog?.body?.title || '',
            imageBody: this.blog?.body?.image || '',
            contentBody: this.blog?.body?.content || '',
          },
        });
      },
    });
  }

  getBlogById(id: string | number) {
    return this.blogService.getDetailBlog(id).pipe(takeUntil(this.$destroy));
  }

  onEditBlog() {
    this.activeModal.close('updated');
  }

  ngOnDestroy(): void {
    this.$destroy.next();
    this.$destroy.complete();
    this.toastService.clear();
  }
}
