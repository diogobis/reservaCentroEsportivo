import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NovaReservaComponent } from './nova-reserva.component';

describe('NovaReservaComponent', () => {
  let component: NovaReservaComponent;
  let fixture: ComponentFixture<NovaReservaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NovaReservaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NovaReservaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
