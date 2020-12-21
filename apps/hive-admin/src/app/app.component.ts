import { Component } from '@angular/core';
import { environment } from '@environments/environment';

@Component({
  selector: 'hive-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'hive-admin';

  env: any;

  constructor() {
    this.env = environment;
  }
}
