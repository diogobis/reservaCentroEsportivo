import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { UsuarioService } from './services/usuario/usuario.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from './assets/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    FormsModule,
    HttpClientModule,
    NavbarComponent,
  ],
  providers: [UsuarioService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'reservaCentroEsportivo';

  constructor(private router: Router) {
    if (!localStorage.getItem('user')) router.navigate(['login']);
  }
}
