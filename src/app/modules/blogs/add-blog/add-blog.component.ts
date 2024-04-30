import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BlogService } from '@app/shared/services/blog.service';
import { ToastService } from '@app/shared/services/toast.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-add-blog',
  templateUrl: './add-blog.component.html',
  styleUrls: ['./add-blog.component.scss'],
})
export class AddBlogComponent implements OnInit {
  @Input() title!: string;
  @Input() message!: string;
  formAddBlog!: FormGroup;
  isLoading = false;
  $destroy: Subject<void> = new Subject<void>();

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
  ) {
    this.formAddBlog = this.fb.group({
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

  ngOnInit() {}

  onAddBlog() {
    this.activeModal.close('created');
  }

  ngOnDestroy() {
    this.$destroy.next();
    this.$destroy.complete();
  }
}
