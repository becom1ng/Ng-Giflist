import {
  Component,
  ElementRef,
  input,
  viewChild,
  computed,
  signal,
  effect,
  inject,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { fromEvent, map, merge, Subject, switchMap } from 'rxjs';
import { UserPreferencesService } from '../../shared/data-access/user-preferences.service';
import { connect } from 'ngxtension/connect';

interface GifPlayerState {
  playing: boolean;
  status: 'initial' | 'loading' | 'loaded';
}

@Component({
  selector: 'app-gif-player',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  template: `
    @if (status() === 'loading') {
      <mat-progress-spinner mode="indeterminate" diameter="50" />
    }
    <div
      class="preload-background"
      [style.background]="'url(' + thumbnail() + ') 50% 50% / cover no-repeat'"
      [class.blur]="
        status() !== 'loaded' &&
        !['/assets/nsfw.png', '/assets/default.png'].includes(thumbnail())
      "
    >
      <video
        (click)="togglePlay$.next()"
        #gifPlayer
        playsinline
        preload="none"
        [loop]="userPrefsService.loop()"
        [muted]="userPrefsService.mute()"
        [src]="src()"
      ></video>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        position: relative;
        overflow: hidden;
        max-height: 80vh;
      }

      .preload-background {
        width: 100%;
        height: auto;
      }

      .blur {
        filter: blur(10px) brightness(0.6);
        transform: scale(1.1);
      }

      video {
        width: 100%;
        max-height: 80vh;
        height: auto;
        margin: auto;
        background: transparent;
      }

      mat-progress-spinner {
        position: absolute;
        top: 2em;
        right: 2em;
        z-index: 1;
      }
    `,
  ],
})
export class GifPlayerComponent {
  userPrefsService = inject(UserPreferencesService);
  src = input.required<string>();
  thumbnail = input.required<string>();

  videoElement = viewChild.required<ElementRef<HTMLVideoElement>>('gifPlayer');
  videoElement$ = toObservable(this.videoElement);

  // state
  state = signal<GifPlayerState>({
    playing: false,
    status: 'initial',
  });

  // selectors
  playing = computed(() => this.state().playing);
  status = computed(() => this.state().status);

  // sources / actions
  togglePlay$ = new Subject<void>();
  videoLoadStart$ = this.togglePlay$.pipe(
    switchMap(() => this.videoElement$),
    switchMap(({ nativeElement }) => fromEvent(nativeElement, 'loadstart')),
  );
  videoLoadComplete$ = this.videoElement$.pipe(
    switchMap(({ nativeElement }) => fromEvent(nativeElement, 'loadeddata')),
  );

  constructor() {
    // reducers
    const nextState$ = merge(
      this.videoLoadStart$.pipe(map(() => ({ status: 'loading' as const }))),
      this.videoLoadComplete$.pipe(map(() => ({ status: 'loaded' as const }))),
    );

    connect(this.state)
      .with(nextState$)
      .with(this.togglePlay$, (state) => ({ playing: !state.playing }));

    effect(() => {
      // const video = this.videoElement().nativeElement (same as below)
      const { nativeElement: video } = this.videoElement();
      const playing = this.playing();
      const status = this.status();

      if (!video) return;

      if (playing && status === 'initial') {
        video.load();
      }

      if (status === 'loaded') {
        playing ? video.play() : video.pause();
      }
    });
  }
}
