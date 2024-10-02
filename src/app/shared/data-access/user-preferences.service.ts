import { computed, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';

export interface UserPrefs {
  loop: boolean;
  mute: boolean;
  hideAdultThumbnails: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class UserPreferencesService {
  private fb = inject(FormBuilder);
  userPrefsFormGroup = this.fb.nonNullable.group({
    loop: [true],
    mute: [true],
    hideAdultThumbnails: [true],
  });

  // state
  private state = signal<UserPrefs>({
    loop: true,
    mute: true,
    hideAdultThumbnails: true,
  });

  // selectors
  loop = computed(() => this.state().loop);
  mute = computed(() => this.state().mute);
  hideAdultThumbnails = computed(() => this.state().hideAdultThumbnails);

  // sources / actions
  private userPrefsChanged$ = this.userPrefsFormGroup.valueChanges.pipe(
    debounceTime(300),
    distinctUntilChanged(),
  );

  constructor() {
    // propagate state to form
    this.userPrefsFormGroup.patchValue({
      loop: this.loop(),
      mute: this.mute(),
      hideAdultThumbnails: this.hideAdultThumbnails(),
    });

    // reducers
    this.userPrefsChanged$.pipe(takeUntilDestroyed()).subscribe(() => {
      this.state.update((state) => ({
        ...state,
        ...this.userPrefsFormGroup.getRawValue(),
      }));
    });
  }
}
