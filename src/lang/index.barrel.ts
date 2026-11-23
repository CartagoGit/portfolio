/**
 * Public surface of the portfolio translation module.
 *
 * Consumers should import from this barrel rather than reaching
 * into individual files; the path aliases documented in
 * `tsconfig.json` resolve `src/lang` here.
 */
export type { ITranslationMap } from './types.interface';
export { en } from './en.translation';
export { es } from './es.translation';
export { fr } from './fr.translation';
export { de } from './de.translation';
export { TranslateService } from './translate.service';
export { TranslatePipe } from './translate.pipe';
