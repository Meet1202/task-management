import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'app-view-task',
  templateUrl: './view-task.component.html',
  styleUrls: ['./view-task.component.scss']
})
export class ViewTaskComponent {

  public statusColor: any = {
    todo: 'warning',
    in_progress: 'primary',
    completed: 'success'
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public __TaskService: TaskService) { }

}
