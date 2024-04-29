import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-edit-blog',
  templateUrl: './edit-blog.component.html',
  styleUrls: ['./edit-blog.component.scss'],
})
export class EditBlogComponent implements OnInit {
  @Input() title!: string;
  @Input() message!: string;
  @Input() blog!: any;
  formEdit!: FormGroup;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
  ) {
    this.formEdit = this.fb.group({
      id: [''],
      title: ['', Validators.required],
      content: ['', Validators.required],
      image: ['', Validators.required],
      createAction: [''],
      body: this.fb.group({
        titleBody: [''],
        imageBody: [''],
        contentBody: [''],
      }),
    });
  }

  ngOnInit(): void {
    this.formEdit.patchValue({
        id: this.blog.id,
        title: this.blog.title,
        content: this.blog.content,
        image: this.blog.image,
        body: {
          title: this.blog?.title || '',
          image: this.blog?.image || '',
          content: this.blog?.content || '',
        },
      });
  }
}
