import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';
import { catchError, map, throwError } from 'rxjs';

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
    return this.http.get(
      `${environment.api}/blogs?page=${page}&limit=${limit}&order=asc`,
    );
  }

  getDetailBlog(id: string | number) {
    return this.http.get(`${environment.api}/blogs/${id}`);
  }

  addNewBlog(data: FormData) {
    return this.http.post(`${environment.api}/blogs`, data);
  }

  editBlog(blogId: string | number, body: FormData) {
    return this.http.put(`${environment.api}/blogs/${blogId}`, body);
  }
  deleteBlog(blogId: string | number) {
    return this.http.delete(`${environment.api}/blogs/${blogId}`);
  }

  searchBlog(keyword: string) {
    return this.http.get(`${environment.api}/blogs?search=${keyword}`).pipe(
      catchError((error: unknown) => {
        if ((error as any).status === 404) {
          return throwError(() => error);
        } else {
          return throwError(() => error);
        }
      }),
    );
  }

  sortBlog(page: number, limit: number, sortField: string, orderBy: string) {
    return this.http.get<any>(
      `${environment.api}/blogs?page=${page}&limit=${limit}&sortBy=${sortField}&order=${orderBy}`,
    );
  }
}
