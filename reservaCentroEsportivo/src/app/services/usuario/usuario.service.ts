import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService extends BaseService {
  constructor(protected http: HttpClient) {
    super(http, 'alunos');
  }

  public filtroPorNome(nome: string): any {
    return this._http.get<any[]>(this.url + '/filtroNome', {
      params: nome ? { nome } : undefined,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
