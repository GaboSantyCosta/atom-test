import { CdkDrag, CdkDragDrop, CdkDropList, CdkDropListGroup, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormField, MatInputModule, MatLabel } from '@angular/material/input';
import { MatFormFieldControl, MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon, MatIconModule } from '@angular/material/icon';

import { Auth } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Task } from '../../../interfaces/task';
import { TaskService } from '../../../services/task.service';

@Component({
  selector: 'app-tasks',
  imports: [
    CdkDropListGroup,
    CdkDropList,
    CdkDrag,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatGridListModule,
    MatIconModule
  ],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss'
})
export class TasksComponent implements OnInit {

  pending: Task[] = [];
  inProgress: Task[] = [];
  done: Task[] = [];

  taskForm: FormGroup;

  selectedTask: Task | null = null;

  constructor(
    private taskService: TaskService,
    private fb: FormBuilder,
    private auth: Auth,
    private _snackBar: MatSnackBar,
  ) {
    this.taskForm = this.initForm();
  }

  initForm(){
    return this.fb.group({
      title: [null,[Validators.required]],
      description: [null,[Validators.required]]
    })
  }

  async createTaskSubmit(){
    if(this.taskForm.valid) {
      const user = this.auth.currentUser;
      if (!user) throw new Error('Not Authenthicated');
      if(this.selectedTask) {
        this.selectedTask.title = this.taskForm.value.title
        this.selectedTask.description = this.taskForm.value.description
        await this.taskService.setTask(this.selectedTask);
        this.openSnackBar('task updated');
        this.selectedTask = null;
      } else {
        const newTask: Task = {
          id: Date.now(),
          title: this.taskForm.value.title,
          description: this.taskForm.value.description,
          createAt: Date.now(),
          status: "pending",
          uid: user.uid
        }
        await this.taskService.setTask(newTask);
        this.openSnackBar('task created');
      }
      this.taskForm.reset();
    }
  }

  ngOnInit(): void {
    this.taskService.task$.subscribe(tasks => {
      if(tasks) {
        this.pending = tasks.filter(t => t.status === 'pending');
        this.inProgress = tasks.filter(t => t.status === 'in progress');
        this.done = tasks.filter(t => t.status === 'done');
      }
    });
  }


  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const movedTask = event.previousContainer.data[event.previousIndex];

      let newStatus: Task['status'];
      switch (event.container.id) {
        case 'pendingList':
          newStatus = 'pending';
          break;
        case 'inProgressList':
          newStatus = 'in progress';
          break;
        case 'doneList':
          newStatus = 'done';
          break;
        default:
          newStatus = movedTask.status;
      }

      const updatedTask: Task = { ...movedTask, status: newStatus };
      this.taskService.setTask(updatedTask);
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  selectTask(task:Task){
    this.selectedTask = task;
    this.taskForm.patchValue({title:task.title});
    this.taskForm.patchValue({description:task.description});
  }

  async deleteTask(task:Task,array:number) {
    await this.taskService.deleteTask(task);
    this.openSnackBar('task deleted');
    this.taskForm.reset();
  }

  private openSnackBar(message: string, action?: string) {
    this._snackBar.open(message, action, {
      horizontalPosition: 'end',
      duration: 3000
    });
  }
}
