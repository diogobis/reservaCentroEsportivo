import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule, NgbModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  public user: any;
  faUser = faUser;

  constructor(private router: Router) {
    this.router.events.subscribe((ev) => {
      if (ev.type == 1) {
        this.user = localStorage.getItem('user')
          ? JSON.parse(localStorage.getItem('user') as string)
          : null;
      }
    });
  }

  public deslogar() {
    this.user = null;
    localStorage.removeItem('user');
    this.router.navigate(['login']);
  }
}
