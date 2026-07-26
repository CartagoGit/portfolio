import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { Locale, PublicLink } from '../../../../domain/portfolio/portfolio.types';

@Component({
  selector: 'app-portfolio-footer',
  imports: [RouterLink],
  templateUrl: './portfolio-footer.component.html',
  styleUrl: './portfolio-footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PortfolioFooterComponent {
  readonly locale = input.required<Locale>();
  readonly links = input.required<readonly PublicLink[]>();
}
