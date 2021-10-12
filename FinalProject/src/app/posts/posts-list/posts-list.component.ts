import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { Post } from '../post.interface';
import { PostsService } from '../posts.service';

import { Subscription } from 'rxjs';

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

  constructor(public postsAPI: PostsService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.postsAPI.getPosts();
    this.postsSub = this.postsAPI.getPostUpdateListener()
      .subscribe((response: Post[]) => {
        this.isLoading = false;
        this.posts = response;
      });
  }

  onDelete(id: string) {
    this.postsAPI.deletePost(id);
  }

  ngOnDestroy() {
    this.postsSub?.unsubscribe();
  }

}
