import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { Post } from '../post.interface';
import { PostsService } from '../posts.service';

import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { subscribeOn } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';

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
  postPerPage = 5;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userId: string | undefined;

  private authStatusSub: Subscription | undefined;
  userIsAuthenticated = false;


  constructor(public postsAPI: PostsService, private authAPI: AuthService) {}
  

  ngOnInit(): void {
    this.isLoading = true;
    this.postsAPI.getPosts(this.postPerPage, this.currentPage);
    this.userId = this.authAPI.getUserId();
    this.postsSub = this.postsAPI
      .getPostUpdateListener()
      .subscribe((postData: {posts: Post[], postCount:number}) => {
        this.isLoading = false;
        this.totalPosts = postData.postCount;
        this.posts = postData.posts;
      });
      
    this.userIsAuthenticated = this.authAPI.getIsAuth();  
    this.authStatusSub = this.authAPI
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authAPI.getUserId();
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
    }, () => {
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.postsSub?.unsubscribe();
    this.authStatusSub?.unsubscribe();
  }

}
