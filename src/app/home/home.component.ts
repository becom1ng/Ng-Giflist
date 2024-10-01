import { Component, inject } from '@angular/core';
import { RedditService } from '../shared/data-access/reddit.service';
import { GifListComponent } from './ui/gif-list.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [GifListComponent],
  template: `
    <h2>Reddit Gif Player</h2>
    <app-gif-list
      [gifs]="redditService.gifs()"
      class="grid-container"
    ></app-gif-list>
  `,
  styles: ``,
})
export default class HomeComponent {
  redditService = inject(RedditService);
}
