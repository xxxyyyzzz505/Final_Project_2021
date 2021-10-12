import { Injectable } from '@angular/core';
import { Post } from './post.interface';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router) { }

  getPosts() {
    this.http
      .get<{ message: string, posts: any }>(
        'http://localhost:3000/api/posts'
      )
      .pipe(map(response => {
        return response.posts.map((post: any) => {
          return {
            title: post.title,
            content: post.content,
            id: post._id
          };
        }); 
      }))
      .subscribe(transformedPosts => {
        this.posts = transformedPosts;
        this.postsUpdated.next([...this.posts]);
      })
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

// For editing the post:
  getPost(id: string | undefined | null ) {
    return this.http
      .get<{_id: string, title: string, content: string}>(
        "http://localhost:3000/api/posts/" + id
      );
  }

  addPost(title: string, content: string) {
    const post: any = {id: null, title: title, content: content};
    this.http
      .post<{message: string, postId: string}>(
        'http://localhost:3000/api/posts', 
        post
      )
      .subscribe(response => {
        post.id = response.postId;
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
        this.router.navigate([""]);
      }) 
  }

  updatePost(id: string, title: string, content: string) {
    const post: Post = { id: id, title: title, content: content};
    this.http.put("http://localhost:3000/api/posts/" + id, post)
      .subscribe(response => {
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id);
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
        this.router.navigate([""]);
      });
  }

  deletePost(id: string) {
    this.http.delete("http://localhost:3000/api/posts/" + id)
      .subscribe(() => {
        const updatedPosts = this.posts.filter(post => post.id !== id);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      })
  }
}

