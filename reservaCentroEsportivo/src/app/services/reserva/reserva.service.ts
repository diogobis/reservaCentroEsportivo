import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReservaService extends BaseService {
  constructor(protected http: HttpClient) {
    super(http, 'reserva');
  }

  public checarDisponibilidade(dataReserva: any, centroEsportivo: any) {
    return lastValueFrom(
      this._http.get(this.url + '/disponibilidade', {
        params: {
          dataReserva,
          centroEsportivo,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      })
    );
  }

  public getInterval(start: string, end: string) {
    return lastValueFrom(
      this._http.get(this.url + '/interval', {
        params: {
          start,
          end,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      })
    ).catch(super.errorHandler);
  }

  public fazerReserva(body: object) {
    return lastValueFrom(
      this._http.post(this.url + '/registrar', body, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
    );
  }

  public getComParticipantes(filter?: any) {
    return lastValueFrom(
      this._http.get(this.url + '/participantes', {
        params: filter ? filter : undefined,
        headers: {
          'Content-Type': 'application/json',
        },
      })
    ).catch(this.errorHandler);
  }

  public getComHorarios(filter?: any) {
    return lastValueFrom(
      this._http.get(this.url + '/horarios', {
        params: filter ? filter : undefined,
        headers: {
          'Content-Type': 'application/json',
        },
      })
    ).catch(this.errorHandler);
  }
}
