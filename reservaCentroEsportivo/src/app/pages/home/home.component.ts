import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReservaService } from '../../services/reserva/reserva.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { registerLocaleData } from '@angular/common';
import localeEn from '@angular/common/locales/pt';
import { CentroEsportivoService } from '../../services/centroEsportivo/centro-esportivo.service';

registerLocaleData(localeEn);

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  providers: [ReservaService, DatePipe, CentroEsportivoService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  public minhasReservas: any;
  public usuarioLogado: any;
  public centrosEsportivos: any;

  constructor(
    private reservaService: ReservaService,
    private datePipe: DatePipe,
    private ctEsportivoService: CentroEsportivoService
  ) {
    this.usuarioLogado = JSON.parse(localStorage.getItem('user') as string);

    let capitalizeFirstLetter = function (str: string | undefined) {
      if (!str) return;

      return str.charAt(0).toUpperCase() + str.slice(1);
    };

    this.ctEsportivoService.get().then((result) => {
      this.centrosEsportivos = result;

      this.reservaService
        .getComParticipantes({ alunoResponsavel: this.usuarioLogado.RA })
        .then((result: any) => {
          this.minhasReservas = result
            .filter((res: any) => new Date() < new Date(res.dataReserva))
            .map((res: any) => {
              res.formattedCtEsport = this.centrosEsportivos.find((ct: any) => {
                return ct.ID == res.centroEsportivo;
              }).descricao;
              res.formattedDate = capitalizeFirstLetter(
                this.datePipe
                  .transform(
                    new Date(res.dataReserva),
                    'EEEE, d MMMM, y',
                    '',
                    'pt-BR'
                  )
                  ?.toString()
              );
              return res;
            });
        });
    });
  }
}
