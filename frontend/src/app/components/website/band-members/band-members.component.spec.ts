import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BandMembersComponent } from './band-members.component';

describe('BandMembersComponent', () => {
  let component: BandMembersComponent;
  let fixture: ComponentFixture<BandMembersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BandMembersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BandMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
