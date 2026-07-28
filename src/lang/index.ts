/**
 * Public surface of the portfolio translation module.
 *
 * Consumers should import from this barrel rather than reaching
 * into individual files; the path aliases documented in
 * `tsconfig.json` resolve `src/lang` here.
 */
export type { ITranslationMap } from './types';
export { en } from './en';
export { es } from './es';
export { TranslateService } from './translate.service';
export { TranslatePipe } from './translate.pipe';
