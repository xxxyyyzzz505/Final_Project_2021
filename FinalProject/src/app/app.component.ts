import { AuthService } from 'src/app/auth/auth.service';
import { Component, OnInit } from '@angular/core';

import { Post } from './posts/post.interface';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  // title = 'FinalProject';
  // storedPosts: Post[] = [];

  // onPostAdded(post: Post) {
  //   this.storedPosts.push(post);
  // }
  constructor(private AuthAPI: AuthService) {
  }

  ngOnInit() {
    this.AuthAPI.autoAuthUser();
  }
}
