import { Post } from './../post.interface';
import { PostsService } from './../posts.service';
import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';


@Component({
  selector: 'app-posts-create',
  templateUrl: './posts-create.component.html',
  styleUrls: ['./posts-create.component.css']
})
export class PostsCreateComponent implements OnInit {
  // enteredTitle = '';
  // enteredContent = '';
  private mode = 'create';
  private postId : any;
  post: any;
  isLoading = false;

  // @Output() postCreated = new EventEmitter<Post>();

  constructor(public postsAPI: PostsService, public route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postsAPI.getPost(this.postId)
          .subscribe(postData => {
            this.isLoading = false;
            this.post = {
              id: postData._id, 
              title: postData.title, 
              content: postData.content}
          });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onSavePost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    if(this.mode === 'create') {
      this.postsAPI.addPost(form.value.title, form.value.content);
    } else {
      this.postsAPI.updatePost(this.postId, form.value.title, form.value.content)
    }
    
    form.resetForm();
  }

}
