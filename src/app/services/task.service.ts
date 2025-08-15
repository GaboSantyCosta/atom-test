import { Auth, authState } from '@angular/fire/auth';
import { Firestore, collection, collectionData, deleteDoc, doc, docData, query, setDoc, where } from '@angular/fire/firestore';
import { Observable, of, switchMap } from 'rxjs';

import { Injectable } from '@angular/core';
import { Task } from '../interfaces/task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

	task$: Observable<Task[] | null | undefined>;

  constructor(
		private readonly auth: Auth,
		private readonly firestore: Firestore
  ){
		this.task$ = authState(auth).pipe(
			switchMap( user => {
				if(user){
          const taskRef = collection(this.firestore, 'tasks');
          const q = query(taskRef, where('uid', '==', user.uid));
          return collectionData(q, { idField: 'id' }) as Observable<Task[]>;
				}else{
					return of(null)
				}
			})
		)
  }

  setTask(task:Task):Promise<void> {
    const tasksCollection = doc(this.firestore, `tasks/${task.id}`);
    return setDoc(tasksCollection, task);
  }

  deleteTask(task:Task) {
    const tasksCollection = doc(this.firestore, `tasks/${task.id}`);
    return deleteDoc(tasksCollection);
  }
  
}
