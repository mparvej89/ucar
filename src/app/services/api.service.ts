import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore, QueryFn } from '@angular/fire/compat/firestore';
import { Observable, ReplaySubject, map } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  public userDetails = new ReplaySubject<any>(1);
  public addDetails = new ReplaySubject<any>(1);
  constructor(private db: AngularFirestore) { }

  setUserDetails(data: any) {
    this.userDetails.next(data);
  }
  getUserDetails() {
    return this.userDetails.asObservable();
  }

  setAddDetails(data: any) {
    this.addDetails.next(data);
  }

  getAddDetails() {
    return this.addDetails.asObservable();
  }

  getLoginUsers(uid) {
    return new Promise<any>((resolve) => {
      this.db.collection('users', ref => ref.where("uid", "==", uid)).valueChanges().subscribe(users => resolve(users));
    })
  }



  createAdd(data: any) {
    return new Promise<any>((resolve, reject) => {
      this.db.collection('adds').doc(data.id).set(JSON.parse(JSON.stringify(data))).then(data => {
        resolve('success');
      }, err => {
        reject('err');
      }).catch(err => {
        reject('err');
      });
    })
  }

  updateAdd(data) {
    return new Promise<any>((resolve, reject) => {
      this.db.collection('adds').doc(data.id).update(data).then(data => {
        resolve('success');
      }, err => {
        reject('err');
      }).catch(err => {
        reject('err');
      });
    })
  }

  getAdds(type) {
    return new Promise<any>((resolve) => {
      if (type && type != 'ALL') {
        this.db.collection('adds', ref => ref.where("type", "==", type).where("status", "==", "APPROVED")).valueChanges().subscribe(adds => resolve(adds));
      }
      else {
        this.db.collection('adds',ref =>ref.where("status", "==", "APPROVED")).valueChanges().subscribe(adds => resolve(adds));
      }
    })
  }

  getPaginatedData(recordsPerPage, cursor?, type?): Observable<any> {
    let queryFn: QueryFn;
    if (cursor === undefined) {
      queryFn = value => value.orderBy('id').where("status", "==", "APPROVED").limit(recordsPerPage);
      /* if (type == 'ALL') {
        queryFn = value => value.orderBy('id').where("status", "==", "APPROVED").limit(recordsPerPage);
      }
      else {
        queryFn = value => value.orderBy('id').where("type", "==", type).where("status", "==", "APPROVED").limit(recordsPerPage);
      } */

    } else {
      queryFn = value => value.orderBy('id').where("status", "==", "APPROVED").limit(recordsPerPage).startAfter(cursor);
      /* if (type == 'ALL') {
        queryFn = value => value.orderBy('id').where("status", "==", "APPROVED").limit(recordsPerPage).startAfter(cursor);
      } else {
        queryFn = value => value.orderBy('id').where("type", "==", type).where("status", "==", "APPROVED").limit(recordsPerPage).startAfter(cursor);
      } */

    }

    return this.db
      .collection('adds', queryFn)
      .snapshotChanges()
      .pipe(
        map(result => {
          return result.map(allData => {
            const data = allData.payload.doc.data();
            const doc = allData.payload.doc;
            return { doc, ...(data as object) };
          });
        })
      );
  }

  deleteAdds(id) {
    this.db.collection('adds').doc(id).delete();
  }

  updateUser(user) {
    return new Promise<any>((resolve, reject) => {
      this.db.collection('users').doc(user.uid).update(JSON.parse(JSON.stringify(user))).then(res => {
        resolve('success');
      }, err => {
        reject('error')
      });
    });
  }

  searchAdds(brandId, kilometer, minPrice:number, maxPrice:number, year) {
    return new Promise<any>((resolve) => {
      this.db.collection('adds', ref => ref.where("brandId", "==", brandId)
        .where("kilometer", "==", kilometer).where("price", ">", minPrice)
        .where("price", "<", maxPrice)
        .where("year", "==", year)).valueChanges().subscribe(adds => resolve(adds));
        
    })
  }

  deleteUser(user) {
    this.db.collection('users').doc(user.uid).delete();
  }
}
