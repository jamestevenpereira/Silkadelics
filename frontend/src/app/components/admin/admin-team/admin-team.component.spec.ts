import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminTeamComponent } from './admin-team.component';
import { SupabaseService } from '../../../core/services/supabase.service';

describe('AdminTeamComponent', () => {
    let component: AdminTeamComponent;
    let fixture: ComponentFixture<AdminTeamComponent>;
    let supabaseServiceMock: any;

    beforeEach(async () => {
        supabaseServiceMock = {
            getTeam: jasmine.createSpy('getTeam').and.returnValue(Promise.resolve({ data: [] })),
            addTeamMember: jasmine.createSpy('addTeamMember').and.returnValue(Promise.resolve({ error: null })),
            updateTeamMember: jasmine.createSpy('updateTeamMember').and.returnValue(Promise.resolve({ error: null })),
            deleteTeamMember: jasmine.createSpy('deleteTeamMember').and.returnValue(Promise.resolve({ error: null })),
            uploadFile: jasmine.createSpy('uploadFile').and.returnValue(Promise.resolve({ data: {}, error: null })),
            getPublicUrl: jasmine.createSpy('getPublicUrl').and.returnValue(Promise.resolve('http://example.com/image.jpg'))
        };

        await TestBed.configureTestingModule({
            imports: [AdminTeamComponent],
            providers: [
                { provide: SupabaseService, useValue: supabaseServiceMock }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(AdminTeamComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
