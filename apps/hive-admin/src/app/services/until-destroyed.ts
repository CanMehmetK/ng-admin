import {Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {InjectableType, Type, ɵComponentType, ɵDirectiveType, ɵNG_PIPE_DEF, ɵPipeDef} from '@angular/core';
import {isFunction} from 'rxjs/internal-compatibility';

const NG_PIPE_DEF = ɵNG_PIPE_DEF as 'ɵpipe';

// Angular doesn't expose publicly `PipeType` but it actually has it.
export interface PipeType<T> extends Type<T> {
  ɵpipe: ɵPipeDef<T>;
}

const DECORATOR_APPLIED: unique symbol = Symbol('__decoratorApplied');

export function isPipe<T>(target: any): target is PipeType<T> {
  return !!target[NG_PIPE_DEF];
}

const DESTROY: unique symbol = Symbol('__destroy');

function missingDecorator<T>(
  type: InjectableType<T> | PipeType<T> | ɵDirectiveType<T> | ɵComponentType<T>
): boolean {
  return !(DECORATOR_APPLIED in type.prototype);
}

function ensureClassIsDecorated(instance: any): never | void {
  if (missingDecorator(instance.constructor)) {
    throw new Error(
      'untilDestroyed operator cannot be used inside directives or ' +
      'components or providers that are not decorated with UntilDestroy decorator'
    );
  }
}

function getSymbol<T>(destroyMethodName?: keyof T): symbol {
  if (typeof destroyMethodName === 'string') {
    return Symbol(`__destroy__${destroyMethodName}`);
  } else {
    return DESTROY;
  }
}

function createSubjectOnTheInstance(instance: any, symbol: symbol): void {
  if (!instance[symbol]) {
    instance[symbol] = new Subject<void>();
  }
}

export function completeSubjectOnTheInstance(instance: any, symbol: symbol): void {
  if (instance[symbol]) {
    instance[symbol].next();
    instance[symbol].complete();
    // We also have to re-assign this property thus in the future
    // we will be able to create new subject on the same instance.
    instance[symbol] = null;
  }
}

function overrideNonDirectiveInstanceMethod(
  instance: any,
  destroyMethodName: string,
  symbol: symbol
): void {
  const originalDestroy = instance[destroyMethodName];

  if (isFunction(originalDestroy) === false) {
    throw new Error(
      `${instance.constructor.name} is using untilDestroyed but doesn't implement ${destroyMethodName}`
    );
  }

  createSubjectOnTheInstance(instance, symbol);

  instance[destroyMethodName] = function () {
    isFunction(originalDestroy) && originalDestroy.apply(this, arguments);
    completeSubjectOnTheInstance(this, symbol);
    // We have to re-assign this property back to the original value.
    // If the `untilDestroyed` operator is called for the same instance
    // multiple times, then we will be able to get the original
    // method again and not the patched one.
    instance[destroyMethodName] = originalDestroy;
  };
}

export function untilDestroyed<T>(instance: T, destroyMethodName?: keyof T) {
  return <U>(source: Observable<U>) => {
    const symbol = getSymbol<T>(destroyMethodName);

    // If `destroyMethodName` is passed then the developer applies
    // this operator to something non-related to Angular DI theme
    if (typeof destroyMethodName === 'string') {
      overrideNonDirectiveInstanceMethod(instance, destroyMethodName, symbol);
    } else {
      ensureClassIsDecorated(instance);
      createSubjectOnTheInstance(instance, symbol);
    }

    return source.pipe(takeUntil<U>((instance as any)[symbol]));
  };
}
