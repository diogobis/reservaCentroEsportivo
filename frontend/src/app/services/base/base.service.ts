import { Inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BaseService {
  protected url: string;

  constructor(
    protected _http: HttpClient,
    @Inject('COLLECTION_TOKEN') protected route: string
  ) {
    this.route = route;
    this.url = `${environment.api.url}/${this.route}`;
  }

  public async get(filter?: any) {
    return lastValueFrom(
      this._http.get(this.url, {
        params: filter ? filter : undefined,
        headers: {
          'Content-Type': 'application/json',
        },
      })
    ).catch(this.errorHandler);
  }

  public async post(body: object) {
    return lastValueFrom(
      this._http.post(this.url, body, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
    );
  }

  public async delete(ID: number) {
    return lastValueFrom(
      this._http.delete(`${this.url}/${ID}`, {
        headers: { 'Content-Type': 'application/json' },
      })
    );
  }

  public async update(ID: number, options: object) {
    return lastValueFrom(
      this._http.put(`${this.url}/${ID}`, options, {
        headers: { 'Content-Type': 'application/json' },
      })
    );
  }

  protected errorHandler(err: any) {
    throw err;
  }
}
