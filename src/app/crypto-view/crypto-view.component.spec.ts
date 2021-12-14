import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CryptoViewComponent } from './crypto-view.component';
import {ActivatedRoute} from "@angular/router";
import {HttpClientTestingModule} from "@angular/common/http/testing";

describe('CryptoViewComponent', () => {
  let component: CryptoViewComponent;
  let fixture: ComponentFixture<CryptoViewComponent>;

  const fakeActivatedRoute = {
    snapshot: {paramMap: {get(): string { return '123';}}}
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ CryptoViewComponent ],
      providers: [{provide: ActivatedRoute, useValue: fakeActivatedRoute}]
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
