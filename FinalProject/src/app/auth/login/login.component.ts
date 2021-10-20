import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoading = false;
  authStatusSub: Subscription | undefined;


  constructor(public authAPI: AuthService) { }

  ngOnInit(): void {
    this.authStatusSub = this.authAPI.getAuthStatusListener()
      .subscribe( authStatus => {
        this.isLoading = false;
      });
  }

  onLogin(form: NgForm) {
    if (form.invalid) {
      return
    }
    this.authAPI.login(form.value.email, form.value.password);
  }

  ngOnDestroy() {
    this.authStatusSub?.unsubscribe();
  }

}
