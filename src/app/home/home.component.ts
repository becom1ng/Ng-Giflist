import { Component, inject } from '@angular/core';
import { RedditService } from '../shared/data-access/reddit.service';
import { GifListComponent } from './ui/gif-list.component';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SearchBarComponent } from './ui/search-bar.component';
import { UserPreferencesBarComponent } from './ui/user-preferences-bar.component';
import { UserPreferencesService } from '../shared/data-access/user-preferences.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    GifListComponent,
    InfiniteScrollDirective,
    SearchBarComponent,
    MatProgressSpinnerModule,
    UserPreferencesBarComponent,
  ],
  template: `
    <app-search-bar
      [subredditFormControl]="redditService.subredditFormControl"
    ></app-search-bar>

    <app-user-preferences-bar
      [userPrefsFormGroup]="userPrefsService.userPrefsFormGroup"
    ></app-user-preferences-bar>

    @if (redditService.loading()) {
      <mat-progress-spinner mode="indeterminate" diameter="50" />
    } @else {
      <app-gif-list
        [gifs]="redditService.gifs()"
        infiniteScroll
        (scrolled)="
          redditService.pagination$.next(redditService.lastKnownGif())
        "
        class="grid-container"
      />
    }
  `,
  styles: [
    `
      mat-progress-spinner {
        margin: 2rem auto;
      }
    `,
  ],
})
export default class HomeComponent {
  redditService = inject(RedditService);
  userPrefsService = inject(UserPreferencesService);
}
