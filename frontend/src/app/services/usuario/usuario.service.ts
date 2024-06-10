import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService extends BaseService {
  constructor(protected http: HttpClient) {
    super(http, 'usuarios');
  }

  public filtroPorNome(nome: string): any {
    return this._http.get<any[]>(this.url + '/filtroNome', {
      params: nome ? { nome } : undefined,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  public validarRA(participantes: any) {
    return lastValueFrom(
      this._http.get<any[]>(this.url + '/validar', {
        params: {
          participantes: JSON.stringify(
            participantes.map((p: any) => {
              return { nome: p.nome, RA: p.RA };
            })
          ),
        },
        headers: {
          'Content-Type': 'application/json',
        },
      })
    );
  }
}
