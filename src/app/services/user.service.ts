import { Auth, authState } from '@angular/fire/auth';
import { Firestore, doc, docData } from '@angular/fire/firestore';
import { Observable, of, switchMap } from 'rxjs';

import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

	user$: Observable<User | null | undefined>;

	constructor(
		private readonly auth: Auth,
		private readonly firestore: Firestore
	){
		this.user$ = authState(auth).pipe(
			switchMap( user => {
				if(user){
					return docData(doc(firestore,`users/${user.uid}`)) as Observable<User>
				}else{
					return of(null)
				}
			})
		)
	}
  
}
