import { Component, inject } from '@angular/core';
import { RedditService } from '../shared/data-access/reddit.service';
import { GifListComponent } from './ui/gif-list.component';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [GifListComponent, InfiniteScrollDirective],
  template: `
    <h2>Reddit Gif Player</h2>
    <details>
      <summary>Expand Gif List</summary>
      <app-gif-list
        [gifs]="redditService.gifs()"
        infiniteScroll
        (scrolled)="
          redditService.pagination$.next(redditService.lastKnownGif())
        "
        class="grid-container"
      />
    </details>
  `,
  styles: ``,
})
export default class HomeComponent {
  redditService = inject(RedditService);
}
