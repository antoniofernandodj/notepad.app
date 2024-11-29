import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Tab, Option, Config } from "../app.component"
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-editor-tab',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './editor-tab.component.html',
  styleUrl: './editor-tab.component.sass'
})
export class EditorTabComponent {
  configMenuShow = false
  generalMenuShow = false
  openFilesShow = false
  saved = false

  @Input()
  config: Observable<Config> = of({ autosave: false })

  @Input()
  isVisible: boolean = false

  @Input()
  tabs: Array<Tab> = []

  @Input()
  tab: Tab = {name: 'Documento sem título', content: '', i: 0, visible: false}

  @Output()
  tabAdded = new EventEmitter<string>();

  @Output()
  configUpdated = new EventEmitter<Config>();
  
  openFilesToggle() {
    if (!this.openFilesShow) {
      this.hideAll()
    }
    this.tabs = this.getItem('files') || []
    this.openFilesShow = !this.openFilesShow
  }

  updateAutosave(event: boolean) {
    this.configUpdated.emit({autosave: event})
  }

  configuracoesToggle() {
    if (!this.configMenuShow) {
      this.hideAll()
    }
    this.configMenuShow = !this.configMenuShow
  }

  generalMenuToggle() {
    if (!this.generalMenuShow) {
      this.hideAll()
    }
    this.generalMenuShow = !this.generalMenuShow
  }

  openFile(tab: Tab) {
    this.tab.name = tab.name
    this.tab.content = tab.content

    this.openFilesToggle()
  }

  saveFile() {
    let parts = this.tab.name.split('.');
    if (parts.length < 2 || !parts[parts.length - 1]) {
      if (this.tab.name.charAt(this.tab.name.length - 1) === '.') {
        this.tab.name = this.tab.name.slice(0, -1) + '.txt';
      } else {
        this.tab.name += '.txt';
      }
    }

    this.popFileByName(this.tab.name)
    this.addFile({
      name: this.tab.name,
      content: this.tab.content,
      i: this.tab.i,
      visible: this.tab.visible
    })
    this.saved = true
  }

  removeFile() {
    let tab = this.popFileByName(this.tab.name)
    if (tab) {
      this.tab.name = `Documento sem título ${this.tab.i}`
      this.tab.content = ''
      this.saved = false
    }
  }

  newTab() {
    this.tabAdded.emit('')
  }

  private setItem(key: string, object: any) {
    localStorage.setItem(
      key, JSON.stringify(object)
    )
  }

  private getItem(key: string): Option<any>  {
    let item = localStorage.getItem(key)
    if (!item) {
      return null
    }
    return JSON.parse(item)
  }

  private addFile(file: Tab) {


    let files: Array<Tab> = this.getItem('files') || []
    this.setItem('files', [...files, file])
    console.log('adicionado')
  }

  private popFileByName(name: string) {

    let files: Array<Tab> = this.getItem('files') || []
    let fileIndex = files.findIndex((file) => file.name === name);

    if (fileIndex !== -1) {
      // Remove o arquivo da lista e atualiza o armazenamento
      const [removedFile] = files.splice(fileIndex, 1);
      this.setItem('files', files);
      return removedFile; // Retorna o arquivo removido
    }
  
    return undefined;
  }

  downloadFile() {
    if (!this.tab.name || !this.tab.content) {
      alert('Nenhum arquivo para download.');
      return;
    }
  
    const blob = new Blob([this.tab.content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = this.tab.name;
    a.click();
    window.URL.revokeObjectURL(url);

  }

  hideAll() {
    this.configMenuShow = false
    this.generalMenuShow = false
    this.openFilesShow = false
  }

  runAutosave() {

    this.config.subscribe((config: Config) => {

      if (config.autosave) {
        this.saveFile()
      }
    })
  }

}
