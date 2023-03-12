import { SyntheticEvent } from 'react';

// <form onSubmit={onPromise(handleSubmit(onSubmit))}>
export function onPromise<T>(promise: (event: SyntheticEvent) => Promise<T>) {
  return (event: SyntheticEvent) => {
    if (promise) {
      promise(event).catch((error) => {
        console.error('Unexpected error', error);
      });
    }
  };
}
