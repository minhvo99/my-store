import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';
import { map } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class BlogService {
    constructor(private http: HttpClient) {}

    getTotalPages(itemsPerPage: number) {
        return this.http
            .get(`${environment.api}/blogs`)
            .pipe(map((data: any) => Math.ceil(data.length / itemsPerPage)));
    }

    getBlogs(page: number, limit: number) {
        return this.http.get(`${environment.api}/blogs?page=${page}&limit=${limit}`);
    }

    getDetailBlog(id: string | number) {
        return this.http.get(`${environment.api}/blogs/${id}`);
    }

    addNewBlog() {}

    editBlog(blogId: string | number, body: FormData) {
        return this.http.put(`${environment.api}/blogs/${blogId}`, body);
    }
    deleteBlog(blogId: string | number) {
        return this.http.delete(`${environment.api}/blogs/${blogId}`);
    }
}
