import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../services/task.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-manage-task',
  templateUrl: './manage-task.component.html',
  styleUrls: ['./manage-task.component.scss']
})
export class ManageTaskComponent implements OnInit {

  formGroup: FormGroup;

  allStatus = ['todo', 'in_progress', 'completed'];
  minDate = new Date();
  taskData: any = {}
  taskId: number = 0;

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private __TaskService: TaskService,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {
    this.formGroup = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      due_date: ['', Validators.required],
      status: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((res: any) => {
      this.taskId = res.id;
      if (res.id) {
        this.getTaskDetail(res.id);
      }
    })
  }

  getTaskDetail(id: number) {
    this.__TaskService.getDetail(id).subscribe({
      next: (res: any) => {
        this.taskData = res.data;
        this.formGroup.patchValue(this.taskData);
      }
    })
  }

  onSubmit() {
    this.taskId ? this.onEdit() : this.onSave();
  }


  onEdit() {
    if (this.formGroup.valid) {
      this.__TaskService.edit(this.formGroup.value, this.taskId).subscribe({
        next: () => {
          this._snackBar.open('Task update successfully!', '', {
            duration: 2000,
          });
          this.router.navigate(['/']);
        },
        error: (err) => {
          this._snackBar.open(this.__TaskService.errorHandler(err), '', {
            duration: 2000,
          });
        }
      })
    } else {
      this._snackBar.open('Please fill all required fields.', '', {
        duration: 2000,
      });
    }
  }


  onSave() {
    if (this.formGroup.valid) {
      this.__TaskService.save(this.formGroup.value).subscribe({
        next: () => {
          this._snackBar.open('Task saved successfully!', '', {
            duration: 2000,
          });
          this.router.navigate(['/']);
        },
        error: (err) => {
          this._snackBar.open(this.__TaskService.errorHandler(err), '', {
            duration: 2000,
          });
        }
      })
    } else {
      this._snackBar.open('Please fill all required fields.', '', {
        duration: 2000,
      });
    }

  }

}
