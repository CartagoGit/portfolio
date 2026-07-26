import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { Locale, PortfolioPageId } from '../../../../domain/portfolio/portfolio.types';

@Component({
  selector: 'app-command-palette',
  imports: [RouterLink],
  templateUrl: './command-palette.component.html',
  styleUrl: './command-palette.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommandPaletteComponent {
  readonly open = input.required<boolean>();
  readonly locale = input.required<Locale>();
  readonly close = output<void>();
  readonly navigate = output<PortfolioPageId>();

  protected routeFor(page: PortfolioPageId): string[] {
    return page === 'home' ? ['/', this.locale()] : ['/', this.locale(), page];
  }

  protected select(page: PortfolioPageId): void {
    this.navigate.emit(page);
    this.close.emit();
  }
}
