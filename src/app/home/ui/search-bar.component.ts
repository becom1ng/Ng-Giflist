import { Component, ElementRef, input, output, viewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { RANDOM_SUBREDDIT } from '../../shared/interfaces';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatToolbarModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  template: `
    <mat-toolbar>
      <mat-form-field appearance="outline">
        <input
          matInput
          placeholder="subreddit..."
          type="text"
          #subredditForm
          [formControl]="subredditFormControl()"
        />
        <mat-icon matSuffix>search</mat-icon>
      </mat-form-field>
      <button mat-fab extended (click)="randomSubreddit()">
        <mat-icon>shuffle</mat-icon>
        Random
      </button>
    </mat-toolbar>
  `,
  styles: [
    `
      mat-toolbar {
        height: 80px;
      }

      mat-form-field {
        width: 100%;
        padding-top: 20px;
      }

      button {
        margin-left: 1rem;
      }
    `,
  ],
})
export class SearchBarComponent {
  subredditFormControl = input.required<FormControl>();

  randomSubreddit() {
    const output =
      RANDOM_SUBREDDIT[Math.floor(Math.random() * RANDOM_SUBREDDIT.length)];

    this.subredditFormControl().setValue(output);
  }
}
