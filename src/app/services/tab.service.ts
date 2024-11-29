import { Injectable } from '@angular/core';
import { BehaviorSubject, of, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TabService {

  private index = new BehaviorSubject<number[]>([1]);
  index$ = this.index.asObservable();

  constructor() {}


}
