import { Auth, UserCredential, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';

import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
		private readonly auth: Auth,
		private readonly firestore: Firestore
  ) { }

  /**
   * Sign in
   *
   * @param credentials
   */
  async signIn(email: string, password: string ): Promise<UserCredential> {
    return await signInWithEmailAndPassword(this.auth,email,password)
  }

  /**
   * Sign out
   */
  async signOut(): Promise<void> {
    return await signOut(this.auth);
  }

  /**
   * Create User With Email And Password
   *
   * @param email
   * @param password
   * @param name
   */
  async createUserWithEmailAndPassword(email:string,password:string,name:string): Promise<void> {
    const credential = await createUserWithEmailAndPassword(this.auth,email,password);
    const newUser: User = {
      uid: credential.user.uid,
      email,
      name
    }
    const tasksCollection = doc(this.firestore, `users/${newUser.uid}`);
    return await setDoc(tasksCollection, newUser);
  }
  
}
