import type { IArcadeCopyKey } from '../../../lang/arcade.translation';

export type IArcadeGameId = 'runner' | 'shooter' | 'lanes' | 'penalty' | 'rpg' | 'maze';
export type IArcadePhase = 'ready' | 'running' | 'won' | 'lost';

export interface IArcadeTab {
	readonly id: IArcadeGameId;
	readonly labelKey: IArcadeCopyKey;
}
