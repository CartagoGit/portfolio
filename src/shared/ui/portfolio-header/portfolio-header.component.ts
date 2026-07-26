import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import type {
  LanguageOption,
  Locale,
  PortfolioCopy,
  PortfolioPageId,
} from '../../../domain/portfolio.types';

@Component({
  selector: 'app-portfolio-header',
  imports: [RouterLink],
  templateUrl: './portfolio-header.component.html',
  styleUrl: './portfolio-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PortfolioHeaderComponent {
  readonly locale = input.required<Locale>();
  readonly page = input.required<PortfolioPageId>();
  readonly copy = input.required<PortfolioCopy>();
  readonly languages = input.required<readonly LanguageOption[]>();
  readonly menuOpen = input.required<boolean>();
  readonly localeMenuOpen = input.required<boolean>();
  readonly localeMenuClosing = input.required<boolean>();
  readonly lightMode = input.required<boolean>();
  readonly scrolled = input.required<boolean>();
  readonly navigate = output<PortfolioPageId>();
  readonly menuToggle = output<void>();
  readonly localeToggle = output<void>();
  readonly localeSelect = output<Locale>();
  readonly themeToggle = output<void>();

  protected routeFor(page: PortfolioPageId): string[] {
    return page === 'home' ? ['/', this.locale()] : ['/', this.locale(), page];
  }
  protected selectPage(page: PortfolioPageId): void {
    this.navigate.emit(page);
  }
}
