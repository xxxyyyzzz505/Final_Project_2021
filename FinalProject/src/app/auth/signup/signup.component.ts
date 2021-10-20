import { Subscription } from 'rxjs';
import { AuthService } from './../auth.service';
import { NgForm } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authStatusSub: Subscription | undefined;

  constructor(public authDataAPI: AuthService) { }

  ngOnInit(): void {
    this.authStatusSub = this.authDataAPI.getAuthStatusListener()
      .subscribe( authStatus => {
        this.isLoading = false;
      });
  }

  onsignup(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authDataAPI.createUser(form.value.email, form.value.password)
    // this.isLoading = false;
  }

  ngOnDestroy() {
    this.authStatusSub?.unsubscribe();
  }

}
