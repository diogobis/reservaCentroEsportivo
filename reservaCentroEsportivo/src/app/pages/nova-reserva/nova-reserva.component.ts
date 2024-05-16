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

@Component({
  selector: 'app-nova-reserva',
  standalone: true,
  providers: [ReservaService, UsuarioService, DatePipe],
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

  public allHorarioOptions: string[] = [
    '08h às 10h',
    '10h às 12h',
    '12h às 14h',
    '14h às 16h',
    '16h às 18h',
  ];
  public filterHorarioOptions: string[] = [];

  public reservaInfo = {
    centroEsportivo: null,
    dataReserva: null,
    horario: null,
    alunoResponsavel: null,
  };

  public participantes: any[] = [];

  constructor(
    private reservaService: ReservaService,
    private usuarioService: UsuarioService,
    public datePipe: DatePipe,
    private router: Router
  ) {
    this.usuarioLogado = JSON.parse(localStorage.getItem('user') as string);

    this.usuarioLogado.RA = this.usuarioLogado.RA.toString().padStart(8, '0');
    this.reservaInfo.alunoResponsavel = this.usuarioLogado.RA;
  }

  ngOnInit() {}

  public filterAutocomplete() {
    if (this.myControl.value === '') return;

    this.filteredOptions = this.usuarioService.filtroPorNome(
      this.myControl.value
    );
  }

  public getMonday(d: Date) {
    let first = d.getDate() - d.getDay();
    let last = first + 13;
    let start = new Date(d.setDate(first));
    start.setHours(0);
    start.setMinutes(0);
    start.setSeconds(0);
    start.setMilliseconds(0);

    let end = new Date(d.setDate(last));
    end.setHours(23);
    end.setMinutes(59);
    end.setSeconds(59);
    end.setMilliseconds(999);

    return { start, end };
  }

  public adicionarParticipante() {
    if (!this.myControl.value) return;

    this.usuarioService
      .get({ nome: this.myControl.value })
      .then((result: any) => {
        if (this.participantes.find((p) => p.RA == result[0].RA)) return;
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

    this.reservaService
      .get({
        dataReserva: this.reservaInfo.dataReserva,
        centroEsportivo: this.reservaInfo.centroEsportivo,
      })
      .then((result: any) => {
        this.filterHorarioOptions = this.allHorarioOptions.filter((hora) => {
          return !result.find((reserva: any) => {
            return reserva.horario == hora;
          });
        });
      });
  }

  public fazerReserva() {
    this.reservaService.fazerReserva({
      ...this.reservaInfo,
      participantes: this.participantes,
    });
    this.router.navigate(['home']);
  }
}
