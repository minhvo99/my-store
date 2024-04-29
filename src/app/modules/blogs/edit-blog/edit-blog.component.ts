import { Component, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';

@Component({
    selector: 'app-edit-blog',
    templateUrl: './edit-blog.component.html',
    styleUrls: ['./edit-blog.component.scss'],
})
export class EditBlogComponent implements OnInit {
    @Input() dataToggle!: string;
    @Input() dataTarget!: string;
    @ViewChild('container', {
        read: ViewContainerRef,
        static: true,
    })
    container!: ViewContainerRef;

    constructor() {}

    ngOnInit(): void {}
}
