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
import {MatPaginator, PageEvent} from "@angular/material/paginator";

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [
    MatAccordion,
    MatExpansionModule,
    MatButton,
    RouterLink,
    MatProgressSpinner,
    MatPaginator
  ],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.scss'
})
export class PostListComponent implements OnInit, OnDestroy {
  posts:Post[] = [];
  isLoading = false;
  private postSubs!: Subscription;
  totalPosts = 13;
  postsPerPage = 2;
  pageSizeOptions = [1, 2, 5, 10, 15];
  currentPage = 1;

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.postService.getPosts(this.currentPage, this.postsPerPage);

    this.postSubs = this.postService.getAllPosts().subscribe(data => {
      this.isLoading = false;
      this.posts = data.posts;
      this.totalPosts = data.totalPosts;
    });
  }

  ngOnDestroy() {
    this.postSubs.unsubscribe();
  }

  delete(postId: string) {
    this.postService.deletePost(postId).subscribe(() => {
      this.postService.getPosts(this.currentPage, this.postsPerPage);
    });
  }

  onPageChanged($event: PageEvent) {
    //this.isLoading = true;
    console.log('onPageChanged', $event);
    this.currentPage = +$event.pageIndex+1;
    this.postsPerPage = +$event.pageSize;

    this.postService.getPosts(this.currentPage, this.postsPerPage);
  }
}
