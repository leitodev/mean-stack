import { Injectable } from '@angular/core';
import {Post} from "./post";
import {Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient) { }

  getPosts() {
    this.http.get<{message: string, posts: Post[]}>('http://localhost:3000/api/posts').subscribe(data => {
      this.posts = data.posts;
      this.postsUpdated.next([...data.posts]);
    });
  }

  updatePost(updatedPost: {id: string, title: string, content: string, image: File | null}) {
    console.log('update!!!!!!!!!!!!', updatedPost);

    this.http.put(`http://localhost:3000/api/posts/${updatedPost.id}`, updatedPost).subscribe(data => {
      console.log('### after update', data);
    })
  }

  getPost(id: string) {
    return {...this.posts.find(post => post.id === id)}
  }

  addNewPost(post: Post) {
    this.http.post<{ message: number, data: Post }>('http://localhost:3000/api/posts', post).subscribe(result => {
      console.log('after post', result);

      this.posts.push(result.data);
      this.postsUpdated.next([...this.posts]);
    })
  }

  getAllPosts() {
    return this.postsUpdated.asObservable();
  }

  deletePost(postId: string) {
    this.http.delete('http://localhost:3000/api/posts/' + postId).subscribe(data => {

      this.posts = this.posts.filter(post => post.id !== postId)
      this.postsUpdated.next([...this.posts]);

    });
  }


}
