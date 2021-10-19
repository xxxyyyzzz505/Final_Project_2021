import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private authListenerSubs: Subscription;
  userIsAuthenticated = false;

  constructor(private authAPI: AuthService) {
    this.userIsAuthenticated = this.authAPI.getIsAuth();
    this.authListenerSubs = this.authAPI
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });
  }

  ngOnInit(): void {
  }

  onLogout() {
    this.authAPI.logout();
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }

}
