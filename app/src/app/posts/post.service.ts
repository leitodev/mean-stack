import {inject, Injectable} from '@angular/core';
import {Post} from "./post";
import {Subject} from "rxjs";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[], totalPosts: number }>();
  private readonly router = inject(Router);

  constructor(private http: HttpClient) { }

  getPosts(page: number, postsPerPage: number) {
    const params  = new HttpParams()
      .set('page', page)
      .set('pagesize', postsPerPage);

    this.http.get<{message: string, posts: Post[], totalPosts: number}>('http://localhost:3000/api/posts', {params}).subscribe(data => {
      this.posts = data.posts;
      this.postsUpdated.next({posts: [...data.posts], totalPosts: data.totalPosts});
    });
  }

  updatePost(updatedPost: {id: string, title: string, content: string, image: File | null | string}) {
    console.log('update!!!!!!!!!!!!', updatedPost);

    let postData: Post | FormData;
    if (updatedPost.image && typeof updatedPost.image === 'object') {
      postData = new FormData();
      postData.append('title', updatedPost.title);
      postData.append('content', updatedPost.content);
      postData.append('image', updatedPost.image, updatedPost.title);
    } else {
      postData = {
        id: updatedPost.id,
        title: updatedPost.title,
        content: updatedPost.content,
        imagePath: updatedPost.image ? updatedPost.image : ''
      }
    }

    this.http.put(`http://localhost:3000/api/posts/${updatedPost.id}`, postData).subscribe({
      next: (data) => {
        console.log('after update', data);
        this.router.navigate(['']).then(() => {});
      },
      error: err => {
        alert(err.error.message); // TODO need toaster
        console.error('error update', err.error.message);
      }
    })
  }

  getPost(id: string) {
    return {...this.posts.find(post => post.id === id)}
  }

  // TODO use TS utility for create another type (concat exist with image: File )
  addNewPost(post: Post) {
    const postData = new FormData();
    postData.append('title', post.title);
    postData.append('content', post.content);
    if (post.image) {
      postData.append('image', post.image, post.title);
    }

    this.http.post<{ message: number, data: Post, totalPosts: number }>('http://localhost:3000/api/posts', postData)
      .subscribe(result => {
        console.log('after post added', result);
        this.router.navigate(['']).then(() => {});
      });

  }

  getAllPosts() {
    return this.postsUpdated.asObservable();
  }

  deletePost(postId: string) {
    return this.http.delete<{totalPosts: number, message: string}>('http://localhost:3000/api/posts/' + postId);
  }


}
