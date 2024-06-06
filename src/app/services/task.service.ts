import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Task } from '../interface/task';
import { of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http: HttpClient) { }

  getList(params: any) {
    return this.http.get(environment.API_URL, { params });
  }

  getDetail(id: number) {
    return this.http.get(`${environment.API_URL}/${id}`);
  }

  save(postdata: Task) {
    return this.http.post(environment.API_URL, postdata);
  }

  edit(postdata: Task, id: number) {
    return this.http.patch(`${environment.API_URL}/${id}`, postdata);
  }

  delete(id: number) {
    return this.http.delete(`${environment.API_URL}/${id}`);
  }

  // This below logic is for to check that date is past date not today's or future date.
  isPastDate(dueDate: any) {
    const dueDateObj = new Date(dueDate);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    return dueDateObj < yesterday;
  }

  errorHandler(err: any) {
    return err.error.errors[0].message;
  }
}
