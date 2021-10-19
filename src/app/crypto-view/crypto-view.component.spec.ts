import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CryptoViewComponent } from './crypto-view.component';

describe('CryptoViewComponent', () => {
  let component: CryptoViewComponent;
  let fixture: ComponentFixture<CryptoViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CryptoViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CryptoViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
