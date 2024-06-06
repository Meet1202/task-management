import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { TaskListComponent } from './task-list.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TaskService } from '../services/task.service';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { environment } from 'src/environments/environment';
import { RouterTestingModule } from "@angular/router/testing";
import { Router } from "@angular/router";

fdescribe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;
  let taskService: TaskService;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TaskListComponent],
      imports: [MatDialogModule, HttpClientTestingModule, MatSnackBarModule, MatTableModule, RouterTestingModule],
      providers: [TaskService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TaskListComponent);
    taskService = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getTask function when ngOninit called', () => {
    const getFun = spyOn(component, 'getTasks');
    component.ngOnInit();
    expect(getFun).toHaveBeenCalled();
  });

  it('should show loader when call getTask function', () => {
    const getFun = spyOn(component, 'getTasks');
    component.ngOnInit();
    expect(getFun).toHaveBeenCalled();
    expect(component.isTaskLoading).toBeTruthy();
  });

  it('should call get api call getTask function and return data', fakeAsync(() => {
    const mockData = [
      {
        id: 1,
        title: 'test title',
        description: 'test description'
      }
    ]
    const req = httpMock.expectOne(environment.API_URL);
    expect(req.request.method).toEqual("GET");
    req.flush({ data: mockData });
    expect(component.taskList.length).toBe(mockData.length);
    expect(component.isTaskLoading).toBeFalsy();
  }));

  it('Should redirect to edit page with id', () => {
    const navigate = spyOn(router, 'navigate');
    component.redirect(1);
    expect(navigate).toHaveBeenCalled();
  })

  it('Should pass sort query desc if sortDirection is asc in get task api', () => {
    const getTask = spyOn(component, 'getTasks');
    component.sortDirection = 'asc'
    component.announceSortChange();
    expect(getTask).toHaveBeenCalled();
  })

  it('Should pass sort query asc if sortDirection is desc in get task api', () => {
    const getTask = spyOn(component, 'getTasks');
    component.sortDirection = 'desc'
    component.announceSortChange();
    expect(getTask).toHaveBeenCalled();
  })

  it('Should open dialog to view task', () => {
    const opendialog = spyOn(component.dialog, 'open');
    component.openDialog({});
    expect(opendialog).toHaveBeenCalled();
  })
});
