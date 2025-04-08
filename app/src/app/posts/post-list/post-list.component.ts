import {Component, OnDestroy, OnInit} from '@angular/core';
import {
  MatAccordion,
} from "@angular/material/expansion";

import {MatExpansionModule} from '@angular/material/expansion';
import {Post} from "../post";
import {PostService} from "../post.service";
import {Subscription} from "rxjs";
import {MatButton} from "@angular/material/button";
import {Router, RouterLink} from "@angular/router";
import {MatProgressSpinner} from "@angular/material/progress-spinner";

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [
    MatAccordion,
    MatExpansionModule,
    MatButton,
    RouterLink,
    MatProgressSpinner
  ],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.scss'
})
export class PostListComponent implements OnInit, OnDestroy {
  posts:Post[] = [];
  isLoading = false;
  private postSubs!: Subscription;

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.postService.getPosts();

    this.postSubs = this.postService.getAllPosts().subscribe(posts => {
      this.posts = posts;
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.postSubs.unsubscribe();
  }

  delete(postId: string) {
    this.postService.deletePost(postId);
  }
}
