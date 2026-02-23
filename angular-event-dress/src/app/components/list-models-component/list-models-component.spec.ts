import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListModelsComponent } from './list-models-component';

describe('ListModelsComponent', () => {
  let component: ListModelsComponent;
  let fixture: ComponentFixture<ListModelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListModelsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListModelsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
