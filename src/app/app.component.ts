import { Component, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RedditService } from './shared/data-access/reddit.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserPreferencesService } from './shared/data-access/user-preferences.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: ` <router-outlet /> `,
  styles: [],
})
export class AppComponent {
  redditService = inject(RedditService);
  userPrefsService = inject(UserPreferencesService);
  snackBar = inject(MatSnackBar);

  // ! hack to stop first snackbar from below effect
  counter: number = 0;

  constructor() {
    effect(() => {
      const error = this.redditService.error();

      if (error !== null) {
        this.snackBar.open(error, 'Dismiss', { duration: 4000 });
      }
    });

    effect(() => {
      // ! hack to stop first snackbar from below effect
      this.counter++;
      const hideAdultThumbnails = this.userPrefsService.hideAdultThumbnails();

      if (this.counter > 1) {
        this.snackBar.open(
          'Please reload or input a new subreddit for this change to take effect.',
          'Dismiss',
          { duration: 2000 },
        );
      }
    });
  }
}
