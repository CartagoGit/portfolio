import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import type { Capability, CapabilityId } from '../../../domain/portfolio/portfolio.types';

@Component({
  selector: 'app-approach-page',
  templateUrl: './approach-page.component.html',
  styleUrl: './approach-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApproachPageComponent {
  readonly capabilities = input.required<readonly Capability[]>();
  readonly activeCapability = input.required<CapabilityId>();
  readonly selectedCapability = input.required<Capability>();
  readonly selected = output<CapabilityId>();
}
