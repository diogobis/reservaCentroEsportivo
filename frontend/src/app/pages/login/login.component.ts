import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { Router } from '@angular/router';
import { MsalModule, MsalService } from '@azure/msal-angular';
import { Subject, lastValueFrom } from 'rxjs';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faMicrosoft } from '@fortawesome/free-brands-svg-icons';

import { NgbAlert, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, tap } from 'rxjs/operators';

// @ts-ignore
const $: any = window['$'];

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MsalModule,
    FontAwesomeModule,
    NgbAlertModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [MsalService],
})
export class LoginComponent implements OnInit {
  private _message$ = new Subject<string>();
  successMessage = '';

  @ViewChild('selfClosingAlert', { static: false })
  selfClosingAlert: NgbAlert = new NgbAlert();

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
    this._message$
      .pipe(
        takeUntilDestroyed(),
        tap((message) => (this.successMessage = message)),
        debounceTime(5000)
      )
      .subscribe(() => this.selfClosingAlert?.close());
  }

  async ngOnInit() {
    await lastValueFrom(this.msalService.initialize());
  }

  public loginMicrosoft() {
    try {
      this.msalService.loginPopup().subscribe((result) => {
        let user = result.account;
        this.usuarioService
          .get({ email: user.username })
          .then((result: any) => {
            if (result[0]) {
              localStorage.setItem('user', JSON.stringify(result[0]));
              this.router.navigate(['home']);
            } else {
              this._message$.next(`Login falhou. Tente novamente.`);
            }
          })
          .catch((error) => {
            console.error(error);
            alert('Login falhou');
          });
      });
    } catch (error) {
      console.error(error);
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
