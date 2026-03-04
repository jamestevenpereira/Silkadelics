import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminRepertoireComponent } from './admin-repertoire.component';
import { SupabaseService } from '../../../core/services/supabase.service';
import { of } from 'rxjs';

describe('AdminRepertoireComponent', () => {
    let component: AdminRepertoireComponent;
    let fixture: ComponentFixture<AdminRepertoireComponent>;
    let supabaseServiceMock: any;

    beforeEach(async () => {
        supabaseServiceMock = {
            getRepertoire: jasmine.createSpy('getRepertoire').and.returnValue(Promise.resolve({ data: [], count: 0 })),
            addRepertoireItem: jasmine.createSpy('addRepertoireItem').and.returnValue(Promise.resolve({ error: null })),
            updateRepertoireItem: jasmine.createSpy('updateRepertoireItem').and.returnValue(Promise.resolve({ error: null })),
            deleteRepertoireItem: jasmine.createSpy('deleteRepertoireItem').and.returnValue(Promise.resolve({ error: null }))
        };

        await TestBed.configureTestingModule({
            imports: [AdminRepertoireComponent],
            providers: [
                { provide: SupabaseService, useValue: supabaseServiceMock }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(AdminRepertoireComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
