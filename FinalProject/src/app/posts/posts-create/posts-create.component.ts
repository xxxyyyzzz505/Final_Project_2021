import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-posts-create',
  templateUrl: './posts-create.component.html',
  styleUrls: ['./posts-create.component.css']
})
export class PostsCreateComponent implements OnInit {
  newPost = '';
  enteredValue = '';

  constructor() { }

  ngOnInit(): void {
  }

  onAddPost() {
    this.newPost = this.enteredValue;
    console.log(this.newPost);

  }

}
