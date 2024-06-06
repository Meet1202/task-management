import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskListComponent } from './task-list/task-list.component';
import { ManageTaskComponent } from './manage-task/manage-task.component';

const routes: Routes = [
  {
    path: '', component: TaskListComponent
  },
  {
    path: 'add-task', component: ManageTaskComponent
  },
  {
    path: 'edit-task/:id', component: ManageTaskComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
