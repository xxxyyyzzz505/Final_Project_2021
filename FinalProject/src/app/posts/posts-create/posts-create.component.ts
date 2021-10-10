import { PostsService } from './../posts.service';
import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';

// import { Post } from '../post.interface';

@Component({
  selector: 'app-posts-create',
  templateUrl: './posts-create.component.html',
  styleUrls: ['./posts-create.component.css']
})
export class PostsCreateComponent implements OnInit {
  // enteredTitle = '';
  // enteredContent = '';

  // @Output() postCreated = new EventEmitter<Post>();

  constructor(public postsAPI: PostsService) {}

  ngOnInit(): void {
  }

  onAddPost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.postsAPI.addPost(form.value.title, form.value.content);
    form.resetForm();
  }

}
