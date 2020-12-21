import { Injectable } from '@angular/core';
import { RippleGlobalOptions } from '@angular/material/core';


/**
 * Whether ripples should be disabled globally.
 */
@Injectable({ providedIn: 'root' })
export class AppGlobalRippleOptions implements RippleGlobalOptions {
  disabled: true | undefined;
  animation: { enterDuration: 0; exitDuration: 0; } | undefined;
  terminateOnPointerUp: true | undefined;
}
