import {EventEmitter, Injectable, OnDestroy} from '@angular/core';
import {HubConnection, HubConnectionBuilder, HubConnectionState} from '@microsoft/signalr';
import {environment} from '@environments/environment';
import {Subject} from 'rxjs';
import {CredentialsService} from '@hive/auth/credentials.service';

@Injectable({providedIn: 'root'})
export class HiveSignalRService implements OnDestroy {
  onHiveSignalREvent: EventEmitter<any> = new EventEmitter<any>();
  private hubConnection: HubConnection;
  private unsubscribeAll: Subject<any>;

  constructor(private credentialsService: CredentialsService) {
    if (environment.use_signalr === true) {
      // credentialsService.currentCredentialsCheanged
      //     .pipe(untilDestroyed(this))
      //     .subscribe(t => this.check(this.credentialsService.credentials?.Token));
    }
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }

  invoketest() {
    this.hubConnection
      .invoke('SendMessage', {id: 1, name: 'name'})
      .then();
  }

  private check(token: string) {
    console.log('Check', this.credentialsService.credentials?.Token);
    if (!this.hubConnection) {
      if (token) {
        this.hubConnection = new HubConnectionBuilder()
          .withUrl(`${environment.SIGNALR_SERVER}/hive`, {
            accessTokenFactory() {
              return token;
            }
          }).build();
        this.hubConnection.on('mesaj', (m) => {
          console.log(m);
          this.onHiveSignalREvent.emit(m);
        });
      }
    }

    if (this.hubConnection) {
      if (!this.credentialsService.credentials?.Token) {
        if (this.hubConnection.state !== HubConnectionState.Disconnected) {
          this.hubConnection.stop().catch();
        }
      } else {
        if (this.hubConnection.state !== HubConnectionState.Disconnected) {
          this.hubConnection.start()
            .then()
            .catch();
        }

      }
    }

  }
}
