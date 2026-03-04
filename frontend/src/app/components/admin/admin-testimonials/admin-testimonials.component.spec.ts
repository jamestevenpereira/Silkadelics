import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminTestimonialsComponent } from './admin-testimonials.component';
import { SupabaseService } from '../../../core/services/supabase.service';

describe('AdminTestimonialsComponent', () => {
    let component: AdminTestimonialsComponent;
    let fixture: ComponentFixture<AdminTestimonialsComponent>;
    let supabaseServiceMock: any;

    beforeEach(async () => {
        supabaseServiceMock = {
            getTestimonials: jasmine.createSpy('getTestimonials').and.returnValue(Promise.resolve({ data: [] })),
            addTestimonial: jasmine.createSpy('addTestimonial').and.returnValue(Promise.resolve({ error: null })),
            updateTestimonial: jasmine.createSpy('updateTestimonial').and.returnValue(Promise.resolve({ error: null })),
            deleteTestimonial: jasmine.createSpy('deleteTestimonial').and.returnValue(Promise.resolve({ error: null })),
            uploadFile: jasmine.createSpy('uploadFile').and.returnValue(Promise.resolve({ data: {}, error: null })),
            getPublicUrl: jasmine.createSpy('getPublicUrl').and.returnValue(Promise.resolve('http://example.com/image.jpg'))
        };

        await TestBed.configureTestingModule({
            imports: [AdminTestimonialsComponent],
            providers: [
                { provide: SupabaseService, useValue: supabaseServiceMock }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(AdminTestimonialsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
