import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminPacksComponent } from './admin-packs.component';
import { SupabaseService } from '../../../core/services/supabase.service';

describe('AdminPacksComponent', () => {
    let component: AdminPacksComponent;
    let fixture: ComponentFixture<AdminPacksComponent>;
    let supabaseServiceMock: any;

    beforeEach(async () => {
        supabaseServiceMock = {
            getPacks: jasmine.createSpy('getPacks').and.returnValue(Promise.resolve({ data: [] })),
            updatePack: jasmine.createSpy('updatePack').and.returnValue(Promise.resolve({ error: null }))
        };

        await TestBed.configureTestingModule({
            imports: [AdminPacksComponent],
            providers: [
                { provide: SupabaseService, useValue: supabaseServiceMock }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(AdminPacksComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
