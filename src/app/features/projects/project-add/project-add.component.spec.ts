import {
  commonTestImports,
  commonTestProviders,
} from '../../../../testing/test-utensils';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ProjectAddComponent } from './project-add.component';
import { provideAnimations } from '@angular/platform-browser/animations';

describe('ProjectAddComponent', () => {
  let fixture: ComponentFixture<ProjectAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectAddComponent, ...commonTestImports],
      providers: [...commonTestProviders, provideAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectAddComponent);
    fixture.detectChanges();
  });

  it('skapar komponenten', () =>
    expect(fixture.componentInstance).toBeTruthy());
});
