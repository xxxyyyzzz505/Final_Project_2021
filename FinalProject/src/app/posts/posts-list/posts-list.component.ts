import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { Post } from '../post.interface';
import { PostsService } from '../posts.service';

import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { subscribeOn } from 'rxjs/operators';

@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.css']
})
export class PostsListComponent implements OnInit, OnDestroy {
  // posts =[
  //   {title: 'First Post', content: 'This is the first post\'s content'},
  //   {title: 'Second Post', content: 'This is the second post\'s content'},
  //   {title: 'Third Post', content: 'This is the third post\'s content'}
  // ]
  posts: Post[] = [];
  isLoading = false;
  private postsSub: Subscription | undefined;
  totalPosts = 0;
  postPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];

  constructor(public postsAPI: PostsService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.postsAPI.getPosts(this.postPerPage, this.currentPage);
    this.postsSub = this.postsAPI.getPostUpdateListener()
      .subscribe((postData: {posts: Post[], postCount:number}) => {
        this.isLoading = false;
        this.totalPosts = postData.postCount;
        this.posts = postData.posts;
      });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading =true;
    this.currentPage = pageData.pageIndex + 1;
    this.postPerPage = pageData.pageSize;
    this.postsAPI.getPosts(this.postPerPage, this.currentPage);
  }

  onDelete(id: string) {
    this.isLoading =true;
    this.postsAPI.deletePost(id).subscribe(() => {
      this.postsAPI.getPosts(this.postPerPage, this.currentPage);
    });
  }

  ngOnDestroy() {
    this.postsSub?.unsubscribe();
  }

}
