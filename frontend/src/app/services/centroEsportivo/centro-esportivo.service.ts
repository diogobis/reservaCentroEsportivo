import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CentroEsportivoService extends BaseService {
  constructor(protected http: HttpClient) {
    super(http, 'centrosesportivos');
  }
}
