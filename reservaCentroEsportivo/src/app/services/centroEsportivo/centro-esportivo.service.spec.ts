import { TestBed } from '@angular/core/testing';

import { CentroEsportivoService } from './centro-esportivo.service';

describe('CentroEsportivoService', () => {
  let service: CentroEsportivoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CentroEsportivoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
