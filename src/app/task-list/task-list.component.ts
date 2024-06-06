import { Component, OnInit } from '@angular/core';
import { Task } from '../interface/task';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ViewTaskComponent } from '../view-task/view-task.component';
import { TaskService } from '../services/task.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';


@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})

export class TaskListComponent implements OnInit {
  public taskList: Array<Task> = [];
  public statusColor: any = {
    todo: 'warning',
    inprogress: 'primary',
    completed: 'success'
  };
  public displayedColumns: string[] = ['id', 'title', 'due_date', 'status', 'action'];
  public isTaskLoading = false;
  searchControl = new FormControl();
  public sortDirection = 'desc'

  constructor(
    private router: Router,
    public dialog: MatDialog,
    public __TaskService: TaskService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.getTasks();
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => this.__TaskService.getList({ search: value }))
    ).subscribe((res: any) => {
      this.taskList = res.data;
    });
  }

  redirect(id: number) {
    this.router.navigate(['/edit-task', id])
  }
  announceSortChange() {
    this.sortDirection = this.sortDirection == 'desc' ? 'asc' : 'desc';
    let query: any = {};
    if (this.sortDirection == 'asc') {
      query['sort'] = 'due_date'
    } else {
      query['sort'] = '-due_date'
    }

    this.getTasks(query)
  }

  getTasks(query: any = {}) {
    this.isTaskLoading = true;
    this.__TaskService.getList(query).subscribe({
      next: (res: any) => {
        this.taskList = res.data;
        this.isTaskLoading = false;
      },
      error: (err: any) => {
        console.log(err);
        this.isTaskLoading = false;
      }
    })
  }

  openDialog(task: any) {
    this.dialog.open(ViewTaskComponent, {
      width: '450px',
      maxHeight: '550px',
      data: task,
    });
  }

  deleteTask(task: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: `Are you sure you want to delete T-${task.id}?`,
        okBtnLabel: 'Delete',
        cancelBtnLabel: 'Cancel'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.__TaskService.delete(task.id).subscribe({
          next: () => {
            this.getTasks();
            this._snackBar.open('Task deleted successfully!', '', {
              duration: 2000,
            });
          }
        })
      }
    });
  }
}
