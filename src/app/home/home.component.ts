import { Component, inject } from '@angular/core';
import { RedditService } from '../shared/data-access/reddit.service';
import { GifListComponent } from './ui/gif-list.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [GifListComponent],
  template: `
    <p>Hello world!</p>
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
