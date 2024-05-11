import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  public login = {
    RA: '',
    senha: '',
  };

  constructor(private router: Router, private usuarioService: UsuarioService) {}

  public doLogin() {
    this.usuarioService.get(this.login).then((result: any) => {
      if (result.length == 0) alert('RA ou senha inválido');
      else {
        localStorage.setItem('user', JSON.stringify(result[0]));
        this.router.navigate(['home']);
      }
    });
  }
}
