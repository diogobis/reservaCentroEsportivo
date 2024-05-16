import { Component, OnInit } from '@angular/core';
import { ReservaService } from '../../services/reserva/reserva.service';
import { CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AsyncPipe, DatePipe } from '@angular/common';
import { Observable } from 'rxjs';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Router, RouterModule } from '@angular/router';
import { HorarioService } from '../../services/horario/horario.service';
import { CentroEsportivoService } from '../../services/centroEsportivo/centro-esportivo.service';

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
  ],
})
export class NovaReservaComponent implements OnInit {
  public myControl: FormControl = new FormControl('');
  public filteredOptions: Observable<any[]> | undefined;
  public usuarioLogado: any;

  public minDate = new Date(new Date().valueOf() + 2 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];
  public maxDate = new Date(new Date().valueOf() + 8 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];

  faTimes = faTimes;

  public filterHorarioOptions: any[] = [];

  public reservaInfo = {
    centroEsportivo: null,
    dataReserva: this.minDate,
    horarioID: null,
    alunoResponsavel: null,
  };

  public participantes: any[] = [
    {
      RA: '07251091',
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
      RA: '07251092',
      usuario: 'fulano.1',
      curso: 'Engenharia de Software',
      nome: 'Fulano 1',
      email: 'diogo.freitas@a.unileste.edu.br',
      telefone: '(31) 99982-5752',
      created: '2024-05-10T14:05:33.000Z',
      senha: '1234',
      deleted: null,
    },
    {
      RA: '07251093',
      usuario: 'fulano.2',
      curso: 'Engenharia de Software',
      nome: 'Fulano 2',
      email: 'diogo.freitas@a.unileste.edu.br',
      telefone: '(31) 99982-5752',
      created: '2024-05-10T14:05:33.000Z',
      senha: '1234',
      deleted: null,
    },
    {
      RA: '07251094',
      usuario: 'fulano.3',
      curso: 'Engenharia de Software',
      nome: 'Fulano 3',
      email: 'diogo.freitas@a.unileste.edu.br',
      telefone: '(31) 99982-5752',
      created: '2024-05-10T14:05:33.000Z',
      senha: '1234',
      deleted: null,
    },
    {
      RA: '07251095',
      usuario: 'fulano.4',
      curso: 'Engenharia de Software',
      nome: 'Fulano 4',
      email: 'diogo.freitas@a.unileste.edu.br',
      telefone: '(31) 99982-5752',
      created: '2024-05-10T14:05:33.000Z',
      senha: '1234',
      deleted: null,
    },
    {
      RA: '07251096',
      usuario: 'fulano.5',
      curso: 'Engenharia de Software',
      nome: 'Fulano 5',
      email: 'diogo.freitas@a.unileste.edu.br',
      telefone: '(31) 99982-5752',
      created: '2024-05-10T14:05:33.000Z',
      senha: '1234',
      deleted: null,
    },
    {
      RA: '07251097',
      usuario: 'fulano.6',
      curso: 'Engenharia de Software',
      nome: 'Fulano 6',
      email: 'diogo.freitas@a.unileste.edu.br',
      telefone: '(31) 99982-5752',
      created: '2024-05-10T14:05:33.000Z',
      senha: '1234',
      deleted: null,
    },
    {
      RA: '07251098',
      usuario: 'fulano.7',
      curso: 'Engenharia de Software',
      nome: 'Fulano 7',
      email: 'diogo.freitas@a.unileste.edu.br',
      telefone: '(31) 99982-5752',
      created: '2024-05-10T14:05:33.000Z',
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
    this.usuarioLogado.RA = this.usuarioLogado.RA.toString().padStart(8, '0');
    this.reservaInfo.alunoResponsavel = this.usuarioLogado.RA;

    this.ctService.get().then((result: any) => {
      this.centrosEsportivos = result;
    });
  }

  ngOnInit() {}

  public filterAutocomplete() {
    if (this.myControl.value === '') return;

    this.filteredOptions = this.usuarioService.filtroPorNome(
      this.myControl.value
    );
  }

  public adicionarParticipante() {
    if (!this.myControl.value) return;

    this.usuarioService
      .get({ nome: this.myControl.value })
      .then((result: any) => {
        if (this.participantes.find((p) => p.RA == result[0].RA)) return;
        result[0].RA = '';
        this.participantes.push(result[0]);
        this.myControl.setValue('');
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

    this.reservaService
      .checarDisponibilidade(
        this.reservaInfo.dataReserva,
        this.reservaInfo.centroEsportivo
      )
      .then((result: any) => {
        this.filterHorarioOptions = result;
      });
  }

  public fazerReserva() {
    this.usuarioService.validarRA(this.participantes).then((result: any) => {
      if (result.valid) {
        this.reservaService.fazerReserva({
          ...this.reservaInfo,
          participantes: this.participantes,
        });
        this.router.navigate(['home']);
      } else {
        alert("RA's inválidos!");
      }
    });
  }
}
