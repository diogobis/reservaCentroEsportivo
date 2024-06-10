import { Component, OnInit, ViewChild } from '@angular/core';
import { ReservaService } from '../../services/reserva/reserva.service';
import { CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AsyncPipe, DatePipe } from '@angular/common';
import { Observable, Subject } from 'rxjs';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Router, RouterModule } from '@angular/router';
import { HorarioService } from '../../services/horario/horario.service';
import { CentroEsportivoService } from '../../services/centroEsportivo/centro-esportivo.service';

import { NgbAlert, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, tap } from 'rxjs/operators';

@Component({
  selector: 'app-nova-reserva',
  standalone: true,
  providers: [
    ReservaService,
    UsuarioService,
    HorarioService,
    DatePipe,
    CentroEsportivoService,
  ],
  templateUrl: './nova-reserva.component.html',
  styleUrl: './nova-reserva.component.css',
  imports: [
    CommonModule,
    MatAutocompleteModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    AsyncPipe,
    FontAwesomeModule,
    RouterModule,
    NgbAlertModule,
  ],
})
export class NovaReservaComponent implements OnInit {
  private _message$ = new Subject<string>();
  public invalidParticipantsMessage: any = '';
  public invalidUsuarios: any = null;

  @ViewChild('selfClosingAlert', { static: false })
  selfClosingAlert: NgbAlert = new NgbAlert();

  public autocompleteControl: FormControl = new FormControl('');
  public filteredOptions: Observable<any[]> | undefined;
  public usuarioLogado: any;
  public editingID: number | undefined = undefined;

  public minDate = new Date(new Date().valueOf() + 2 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];
  public maxDate = new Date(new Date().valueOf() + 8 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];

  faTimes = faTimes;

  public filterHorarioOptions: any[] = [];
  public filterCalendario: any[] = [];

  public reservaInfo = {
    centroEsportivo: null,
    dataReserva: this.minDate,
    horarioID: null,
    usuarioResponsavel: null,
  };

  public participantes: any[] = [
    {
      RA: 'A07251091',
      usuario: 'diogo.freitas',
      curso: 'Engenharia de Software',
      nome: 'Diogo Alves Bis de Freitas',
      email: 'diogo.freitas@a.unileste.edu.br',
      telefone: '(31) 99982-5752',
      created: '2024-05-10T14:05:26.000Z',
      senha: '1234',
      deleted: null,
    },
    {
      RA: 'A07251092',
      usuario: 'caio.victor',
      curso: 'Engenharia de Software',
      nome: 'Caio Victor',
      email: 'diogo.freitas@a.unileste.edu.br',
      telefone: '(31) 99982-5752',
      created: '2024-05-17T02:13:02.000Z',
      senha: '1234',
      deleted: null,
    },
    {
      RA: 'A07251093',
      usuario: 'gabriel.caldas',
      curso: 'Engenharia de Software',
      nome: 'Gabriel Caldas',
      email: 'diogo.freitas@a.unileste.edu.br',
      telefone: '(31) 99982-5752',
      created: '2024-05-17T02:13:02.000Z',
      senha: '1234',
      deleted: null,
    },
    {
      RA: 'A07251094',
      usuario: 'miguel.silva',
      curso: 'Engenharia de Software',
      nome: 'Miguel Silva',
      email: 'diogo.freitas@a.unileste.edu.br',
      telefone: '(31) 99982-5752',
      created: '2024-05-17T02:13:02.000Z',
      senha: '1234',
      deleted: null,
    },
    {
      RA: 'A07251095',
      usuario: 'walter.maia',
      curso: 'Engenharia de Software',
      nome: 'Walter Maia',
      email: 'diogo.freitas@a.unileste.edu.br',
      telefone: '(31) 99982-5752',
      created: '2024-05-17T02:13:02.000Z',
      senha: '1234',
      deleted: null,
    },
    {
      RA: 'A07251096',
      usuario: 'gustavo.orodrigues',
      curso: 'Engenharia de Software',
      nome: 'Gustavo Rodrigues',
      email: 'diogo.freitas@a.unileste.edu.br',
      telefone: '(31) 99982-5752',
      created: '2024-05-17T02:13:02.000Z',
      senha: '1234',
      deleted: null,
    },
    {
      RA: 'A07251097',
      usuario: 'ivan.lana',
      curso: 'Engenharia de Software',
      nome: 'Ivan Lana',
      email: 'diogo.freitas@a.unileste.edu.br',
      telefone: '(31) 99982-5752',
      created: '2024-05-17T02:13:02.000Z',
      senha: '1234',
      deleted: null,
    },
    {
      RA: 'A07251098',
      usuario: 'yara.lacerda',
      curso: 'Engenharia de Software',
      nome: 'Yara Lacerda',
      email: 'diogo.freitas@a.unileste.edu.br',
      telefone: '(31) 99982-5752',
      created: '2024-05-17T02:13:02.000Z',
      senha: '1234',
      deleted: null,
    },
  ];

  public ctSelecionado: any = {
    minimoParticipantes: 0,
  };
  public centrosEsportivos: any = [];

  constructor(
    private reservaService: ReservaService,
    private usuarioService: UsuarioService,
    private horarioService: HorarioService,
    private ctService: CentroEsportivoService,
    public datePipe: DatePipe,
    private router: Router
  ) {
    this.usuarioLogado = JSON.parse(localStorage.getItem('user') as string);
    this.reservaInfo.usuarioResponsavel = this.usuarioLogado.RA;

    this._message$
      .pipe(
        takeUntilDestroyed(),
        tap((message) => (this.invalidUsuarios = message)),
        debounceTime(5000)
      )
      .subscribe(() => this.selfClosingAlert?.close());
  }

  async ngOnInit() {
    this.centrosEsportivos = await this.ctService.get();

    if (localStorage.getItem('editingID')) {
      this.editingID = JSON.parse(localStorage.getItem('editingID') as string);
      localStorage.removeItem('editingID');
      this.participantes = [];
      this.edit();
    }
  }

  public async filterAutocomplete() {
    if (this.autocompleteControl.value === '') return;

    this.filteredOptions = this.usuarioService.filtroPorNome(
      this.autocompleteControl.value
    );
  }

  public adicionarParticipante() {
    if (!this.autocompleteControl.value) return;

    this.usuarioService
      .get({ nome: this.autocompleteControl.value })
      .then((result: any) => {
        if (this.participantes.find((p) => p.RA == result[0].RA)) return;
        result[0].RA = '';
        this.participantes.push(result[0]);
        this.autocompleteControl.setValue('');
      });
  }

  public removerParticipante(index: number) {
    this.participantes.splice(index, 1);
  }

  public checarDisponibilidade() {
    if (!this.reservaInfo.centroEsportivo || !this.reservaInfo.dataReserva)
      return;

    this.ctSelecionado = this.centrosEsportivos.find((ct: any) => {
      return ct.ID == this.reservaInfo.centroEsportivo;
    });

    let start = new Date(
      new Date().setDate(new Date().getDate() - new Date().getDay())
    );
    start.setHours(0, 0, 0, 0);

    let end = new Date(
      new Date().setDate(new Date().getDate() + (13 - new Date().getDay()))
    );
    end.setHours(23, 59, 59, 999);

    this.horarioService.get().then((horarios: any) => {
      this.reservaService
        .getComHorarios({
          centroEsportivo: this.reservaInfo.centroEsportivo,
          start: start.toISOString(),
          end: end.toISOString(),
        })
        .then((result: any) => {
          this.filterCalendario = result;

          let weekDates = this.getDatesCurrentAndNextWeek();

          this.filterCalendario = weekDates.map((d: any) => {
            let reservas = result.filter((r: any) => {
              return this.formatDate(d) == this.formatDate(r.dataReserva);
            });

            let horariosDate = horarios.filter((h: any) => {
              return d.getDay() == 6 || d.getDay() == 0
                ? h.tipo == 'F'
                : h.tipo == 'S';
            });

            horariosDate = horariosDate.map((h: any) => {
              let reservasHorario = reservas.filter((r: any) => {
                return r.horarioID == h.ID;
              });

              return {
                ...h,
                reservas: reservasHorario,
              };
            });

            return {
              data: d,
              valid: this.validateDate(d),
              horarios: horariosDate,
            };
          });
        });
    });

    // this.reservaInfo.horarioID = null;
  }

  public validateDate(date: Date) {
    let d = new Date();
    d.setHours(0, 0, 0, 0);
    let startValid = new Date(d.setDate(d.getDate() + 2));
    let endValid = new Date(d.setDate(d.getDate() + 6));

    return (
      date.valueOf() >= startValid.valueOf() &&
      date.valueOf() <= endValid.valueOf()
    );
  }

  public selecionarHorario(data: any, horarioID: any) {
    this.reservaInfo.horarioID = horarioID;
    this.reservaInfo.dataReserva = data;
  }

  public getDatesCurrentAndNextWeek() {
    const today = new Date();

    const startOfWeek = new Date(
      today.setDate(today.getDate() - today.getDay())
    );

    const nextWeekEnd = new Date(
      startOfWeek.getTime() + 14 * 24 * 60 * 60 * 1000 - 1
    );

    let dates = [];
    for (
      let date = startOfWeek;
      date <= nextWeekEnd;
      date.setDate(date.getDate() + 1)
    ) {
      dates.push(new Date(date));
    }

    dates = dates.map((d: Date) => {
      d.setHours(0, 0, 0, 0);
      return d;
    });

    return dates;
  }

  public fazerReserva() {
    this.usuarioService.validarRA(this.participantes).then((result: any) => {
      if (result.valid) {
        this.reservaInfo.dataReserva =
          new Date(this.reservaInfo.dataReserva).toISOString().split('T')[0] +
          ' 00:00:00';
        if (this.editingID === undefined) {
          this.reservaService.fazerReserva({
            ...this.reservaInfo,
            participantes: this.participantes,
          });
        } else {
          this.reservaService.fazerReserva({
            id: this.editingID,
            ...this.reservaInfo,
            participantes: this.participantes,
          });
        }
        this.router.navigate(['home']);
      } else {
        this._message$.next(result.invalidUsuarios);
      }
    });
  }

  public formatDate(date: string) {
    return this.datePipe.transform(date, 'dd/MM/yyyy');
  }

  public diaDaSemana(date: string) {
    let capitalizeFirstLetter = function (str: string | undefined) {
      if (!str) return;

      return str.charAt(0).toUpperCase() + str.slice(1);
    };

    return capitalizeFirstLetter(
      this.datePipe.transform(date, 'EEEE', '', 'pt-BR')?.toString()
    );
  }

  public async edit() {
    let resultReserva: any = await this.reservaService.getComParticipantes({
      ID: this.editingID,
    });
    let editingReserva = resultReserva[0];

    this.reservaInfo = {
      centroEsportivo: editingReserva.centroEsportivo,
      dataReserva: new Date(editingReserva.dataReserva).toString(),
      horarioID: editingReserva.horarioID,
      usuarioResponsavel: editingReserva.usuarioResponsavel,
    };

    this.participantes = editingReserva.participantes;

    this.ctSelecionado = this.centrosEsportivos.find((ct: any) => {
      return ct.ID == this.reservaInfo.centroEsportivo;
    });

    this.checarDisponibilidade();
  }
}
