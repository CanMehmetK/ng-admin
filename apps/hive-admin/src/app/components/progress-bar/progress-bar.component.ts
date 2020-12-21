import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HiveProgressBarService } from './progress-bar.service';

@Component({
  selector: 'hive-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HiveProgressBarComponent implements OnInit, OnDestroy {
  bufferValue: number;
  mode: 'determinate' | 'indeterminate' | 'buffer' | 'query';
  value: number;
  visible: boolean;

  // Private
  private unsubscribeAll: Subject<any>;

  constructor(private hiveProgressBarService: HiveProgressBarService) {
    // Set the defaults

    // Set the private defaults
    this.unsubscribeAll = new Subject();
  }




  ngOnInit(): void {
    // Subscribe to the progress bar service properties

    // Buffer value
    this.hiveProgressBarService.bufferValue.pipe(takeUntil(this.unsubscribeAll)).subscribe((bufferValue) => {
      this.bufferValue = bufferValue;
    });

    // Mode
    this.hiveProgressBarService.mode.pipe(takeUntil(this.unsubscribeAll)).subscribe((mode) => {
      this.mode = mode;
    });

    // Value
    this.hiveProgressBarService.value.pipe(takeUntil(this.unsubscribeAll)).subscribe((value) => {
      this.value = value;
    });

    // Visible
    this.hiveProgressBarService.visible.pipe(takeUntil(this.unsubscribeAll)).subscribe((visible) => {
      this.visible = visible;
    });
  }


  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }

}
