import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { EditorTabComponent } from './editor-tab/editor-tab.component';
import { BehaviorSubject } from 'rxjs';


export type Tab = {name: string, content: string, i: number, visible: boolean}
export type Option<T> = T | null;


export type Config = {
  autosave: boolean
}


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    FormsModule,
    EditorTabComponent,
  ],
  providers: [

  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass'
})
export class AppComponent {

  tabs: Array<Tab> = [
    {name: 'Documento sem título 1', content: '', i: 1, visible: true}
  ]

  private autosave = new BehaviorSubject<Config>({autosave: false});
  public config$ = this.autosave.asObservable()

  constructor(private changeDetector: ChangeDetectorRef) { }

  onTabAdded(_: string) {
    let last = this.tabs[this.tabs.length - 1].i;
    let tab = {
      name: `Documento sem título ${last + 1}`,
      content: '', i: last + 1,
      visible: false
    }
    this.tabs.push(tab)
  }

  onConfigUpdated(event: Config) {
    this.autosave.next(event)
  }

  openTab(tab: Tab) {

    for (let f of this.tabs) {
      if (f.i != tab.i) {
        f.visible = false;
      } else {
        f.visible = true;
      }
    }

  }

  removeTab(file: Tab) {
    if (this.tabs.length == 1) {
      return
    }

    let lastActiveTab = 1;
    for (let f of this.tabs) {
      if (f.i != file.i && f.visible) {
        lastActiveTab = f.i
      }
    }

    this.tabs = [...this.tabs.filter((f: Tab) => f.i !== file.i)];
    for (let file of this.tabs) {
      file.visible = false;
    }
    
    let someVisible = false
    for (let f of this.tabs) { if (f.i == lastActiveTab) {
        f.visible = true;
        someVisible = true
    }};

    if (!someVisible) {
      this.tabs[0].visible = true
    }

    this.changeDetector.detectChanges();
  }

}
