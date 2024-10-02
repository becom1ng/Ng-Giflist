import { Component, input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-user-preferences-bar',
  standalone: true,
  imports: [ReactiveFormsModule, MatCheckboxModule],
  template: `
    <div class="user-prefs" [formGroup]="userPrefsFormGroup()">
      <mat-checkbox formControlName="loop">Loop</mat-checkbox>
      <mat-checkbox formControlName="mute">Mute</mat-checkbox>
      <mat-checkbox formControlName="hideAdultThumbnails"
        >Replace NSFW Thumbnails</mat-checkbox
      >
    </div>
  `,
  styles: [
    `
      .user-prefs {
        display: flex;
        justify-content: center;
        align-items: flex-start;
        gap: 2rem;
      }
    `,
  ],
})
export class UserPreferencesBarComponent {
  userPrefsFormGroup = input.required<FormGroup>();
}
