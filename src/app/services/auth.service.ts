import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { ApiService } from './api.service';
export class AuthInfo {
  constructor(public $uid: string) { }
  isLoggedIn() {
    return !!this.$uid;
  }
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  static UNKNOWN_USER = new AuthInfo('');
  public authInfo$: BehaviorSubject<AuthInfo> = new BehaviorSubject<AuthInfo>(AuthService.UNKNOWN_USER);
  setImagesForUploadData = new ReplaySubject<any>(1);
  constructor(private fireAuth: AngularFireAuth,
    private db: AngularFirestore,
    public api:ApiService) { }


    setImagesDataForUpload(items) {
      this.setImagesForUploadData.next(items);
    }
    getImagesDataForUpload() {
      return this.setImagesForUploadData.asObservable();
    }

  public signInWithEmailPassword(email: string, password: string, fullname: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.fireAuth.createUserWithEmailAndPassword(email, password)
        .then(res => {
          if (res.user) {
            this.db.collection('users').doc(res.user.uid).set({
              uid: res.user.uid,
              email: email,
              fullname: fullname,
              type:'USER'
            });
            this.authInfo$.next(new AuthInfo(res.user.uid));
            resolve(res.user);
          }
        })
        .catch(err => {
          this.authInfo$.next(AuthService.UNKNOWN_USER);
          reject(`login failed ${err}`);
        });
    });
  }



  public login(email: string, password: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.fireAuth.signInWithEmailAndPassword(email, password)
        .then(res => {
          if (res.user) {
            this.authInfo$.next(new AuthInfo(res.user.uid));
            resolve(res.user);
          }
        })
        .catch(err => {
          this.authInfo$.next(AuthService.UNKNOWN_USER);
          reject(`login failed ${err}`);
        });
    });
  }

  public checkAuth() {
    return new Promise((resolve, reject) => {
      this.fireAuth.onAuthStateChanged(user => {
        if (user) {
          resolve(user);
        } else {
          // this.userService.setUserDetails(null);
          this.logout();
          //localStorage.clear();
          //this.userService.setUserDetails(null);
          resolve(false);
        }
      }).catch(err => {
        reject(`reset failed ${err}`);
      });
    });
  }
  public logout(): Promise<void> {
    this.authInfo$.next(AuthService.UNKNOWN_USER);
    return this.fireAuth.signOut();
  }

  
}
