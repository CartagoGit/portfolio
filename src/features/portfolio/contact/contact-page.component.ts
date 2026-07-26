import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-contact-page',
  templateUrl: './contact-page.component.html',
  styleUrl: './contact-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactPageComponent {
  readonly sent = input.required<boolean>();
  readonly submitted = output<void>();
  protected submit(event: SubmitEvent): void {
    event.preventDefault();
    this.submitted.emit();
  }
}
