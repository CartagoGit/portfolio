import { describe, expect, it } from 'vitest';
import { EarthDepthFacade } from './earth-depth.facade';

describe('EarthDepthFacade', () => {
  it('blocks monitor interactions until the globe returns behind it', () => {
    const facade = new EarthDepthFacade();
    expect(facade.blocksMonitor()).toBe(false);
    facade.showInFront();
    expect(facade.blocksMonitor()).toBe(true);
  });
});
