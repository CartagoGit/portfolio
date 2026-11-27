import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PUBLIC_LINKS } from '../../domain/data.constant';
import { TranslatePipe } from '../../lang/translate.pipe';
import { ContactFormComponent } from './contact-form/contact-form.component';
import { ContactPortraitComponent } from './contact-portrait/contact-portrait.component';

interface IContactChannel {
	labelKey: string;
	href: string;
	iconPath?: string;
	imageSrc?: string;
	color?: string;
	external: boolean;
}

const CHANNEL_KEYS: Readonly<Record<string, string>> = {
	LinkedIn: 'pages.contact.ctaLinkedin',
	GitHub: 'pages.contact.ctaGithub',
	'Docker Hub': 'pages.contact.ctaDockerHub',
	npm: 'pages.contact.ctaNpm',
};

@Component({
	selector: 'app-contact-page',
	imports: [ContactFormComponent, ContactPortraitComponent, TranslatePipe],
	templateUrl: './contact.page.html',
	styleUrl: './contact.page.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactPageComponent {
	readonly channels: readonly IContactChannel[] = PUBLIC_LINKS
		.filter(({ group }) => group === 'platform')
		.map((link) => ({
			labelKey: CHANNEL_KEYS[link.label] ?? '',
			href: link.href,
			iconPath: link.iconPath,
			imageSrc: link.imageSrc,
			color: link.color,
			external: true,
		}));
}
