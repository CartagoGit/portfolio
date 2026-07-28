import {
	ChangeDetectionStrategy,
	Component,
	computed,
	input,
	output,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { routeFor } from '../../../core/platform/routing';
import { TranslatePipe } from '../../../lang/translate.pipe';
import type {
	ILanguageOption,
	ILocale,
	IPageComponentId,
	IThemeId,
} from '../../../domain/types';
import type { IThemeDefinition } from '../../../core/platform/theme';

/** Theme definition enriched with the localised label/detail. */
export type IResolvedThemeDefinition = IThemeDefinition & {
	label: string;
	detail: string;
};

@Component({
	selector: 'app-shell-header',
	imports: [RouterLink, TranslatePipe],
	templateUrl: './header.component.html',
	styleUrl: './header.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
	readonly locale = input.required<ILocale>();
	readonly page = input.required<IPageComponentId>();
	readonly languages = input.required<readonly ILanguageOption[]>();
	readonly menuOpen = input.required<boolean>();
	readonly localeMenuOpen = input.required<boolean>();
	readonly localeMenuClosing = input.required<boolean>();
	readonly theme = input.required<IThemeId>();
	readonly themes = input.required<readonly IResolvedThemeDefinition[]>();
	readonly themeMenuOpen = input.required<boolean>();
	readonly themeMenuClosing = input.required<boolean>();
	readonly navigate = output<IPageComponentId>();
	readonly menuToggle = output<void>();
	readonly localeToggle = output<void>();
	readonly localeSelect = output<ILocale>();
	readonly themeToggle = output<void>();
	readonly themeSelect = output<IThemeId>();

	/** Theme definition for the currently active theme; renders the swatch. */
	readonly activeTheme = computed<IResolvedThemeDefinition>(() => {
		const themes = this.themes();
		const active = themes.find((entry) => entry.id === this.theme());
		if (active !== undefined) return active;
		const fallback = themes[0];
		if (fallback === undefined) {
			throw new Error(
				'HeaderComponent.activeTheme: at least one theme must be provided'
			);
		}
		return fallback;
	});

	/** Locale option currently active; renders the flag on the opener button. */
	readonly currentLanguage = computed<ILanguageOption | undefined>(() =>
		this.languages().find((entry) => entry.id === this.locale())
	);

	readonly routeFor = (page: IPageComponentId): string[] =>
		routeFor(page, this.locale());
	selectPage(page: IPageComponentId): void {
		this.navigate.emit(page);
	}
}
