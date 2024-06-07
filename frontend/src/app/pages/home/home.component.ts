import {
  Component,
  OnInit,
  inject,
  Type,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ReservaService } from '../../services/reserva/reserva.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { registerLocaleData } from '@angular/common';
import localeEn from '@angular/common/locales/pt';
import { CentroEsportivoService } from '../../services/centroEsportivo/centro-esportivo.service';
import { HorarioService } from '../../services/horario/horario.service';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTimes, faEdit } from '@fortawesome/free-solid-svg-icons';

// @ts-ignore
const $: any = window['$'];

registerLocaleData(localeEn);

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, FontAwesomeModule],
  providers: [ReservaService, DatePipe, CentroEsportivoService, HorarioService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  @ViewChild('modal') modal?: ElementRef;

  public faTimes = faTimes;
  public faEdit = faEdit;

  public minhasReservas: any = [];
  public usuarioLogado: any;
  public centrosEsportivos: any;
  public horarios: any;

  public excluindoID: number = -1;

  constructor(
    private reservaService: ReservaService,
    private datePipe: DatePipe,
    private ctEsportivoService: CentroEsportivoService,
    private horarioService: HorarioService,
    private router: Router
  ) {
    this.usuarioLogado = JSON.parse(localStorage.getItem('user') as string);
    localStorage.removeItem('editingID');
  }

  public async ngOnInit() {
    this.usuarioLogado = JSON.parse(localStorage.getItem('user') as string);

    let capitalizeFirstLetter = function (str: string | undefined) {
      if (!str) return;

      return str.charAt(0).toUpperCase() + str.slice(1);
    };

    this.centrosEsportivos = await this.ctEsportivoService.get();
    this.horarios = await this.horarioService.get();

    let start = new Date();
    start.setHours(0, 0, 0, 0);

    let result: any = await this.reservaService.getComParticipantes({
      alunoResponsavel: this.usuarioLogado.RA,
      start: start.toISOString(),
    });

    this.minhasReservas = result
      .filter((res: any) => new Date() < new Date(res.dataReserva))
      .map((res: any) => {
        res.horario = this.horarios.find((h: any) => {
          return h.ID == res.horarioID;
        });

        res.formattedCtEsport = this.centrosEsportivos.find((ct: any) => {
          return ct.ID == res.centroEsportivo;
        }).descricao;
        res.formattedDate = capitalizeFirstLetter(
          this.datePipe
            .transform(new Date(res.dataReserva), 'EEEE, d MMM y', '', 'pt-BR')
            ?.toString()
        );
        return res;
      });
  }

  openModal(id: number) {
    $(this.modal?.nativeElement).modal('show');
    $(this.modal?.nativeElement).data('id', id);
  }

  closeModal() {
    $(this.modal?.nativeElement).modal('hide');
  }

  public editar(id: number) {
    localStorage.setItem('editingID', JSON.stringify(id));
    this.router.navigate(['nova-reserva']);
  }

  public async excluir() {
    let id = $(this.modal?.nativeElement).data('id');


    try {
      let result = await this.reservaService.delete(id);

      this.closeModal();
      this.ngOnInit();
    } catch (error) {
      console.error(error);
    }
  }
}
