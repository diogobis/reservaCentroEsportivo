import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { Router } from '@angular/router';
import { MsalModule, MsalService } from '@azure/msal-angular';
import { Configuration, PublicClientApplication } from '@azure/msal-browser';
import { lastValueFrom } from 'rxjs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faMicrosoft } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, MsalModule, FontAwesomeModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [MsalService],
})
export class LoginComponent implements OnInit {
  public faMicrosoft = faMicrosoft;

  public login = {
    RA: '',
    senha: '',
  };

  constructor(
    private router: Router,
    private usuarioService: UsuarioService,
    private msalService: MsalService
  ) {
  }

  async ngOnInit() {
    await lastValueFrom(this.msalService.initialize());
  }

  public loginMicrosoft() {
    try {
      this.msalService.loginPopup().subscribe((result) => {
        let user = result.account;
        console.log(user);
        this.usuarioService
          .get({ email: user.username })
          .then((result: any) => {
            localStorage.setItem('user', JSON.stringify(result[0]));
            this.router.navigate(['home']);
          })
          .catch((error) => {
            console.log(error);
            alert('Login falhou');
          });
      });
    } catch (error) {
      console.log(error);
      alert('Login falhou');
    }
  }

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
