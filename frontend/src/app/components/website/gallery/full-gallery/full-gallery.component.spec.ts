import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullGalleryComponent } from './full-gallery.component';

describe('FullGalleryComponent', () => {
  let component: FullGalleryComponent;
  let fixture: ComponentFixture<FullGalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FullGalleryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FullGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
