// Strategy: late-stage completion-leg momentum — ride tokens completing their
// bonding curve in the final leg; dev PnL +0.572934 SOL on the kit sim window.
// The grader runs `node /bot/main.ts`; the strategy lives in strategy.ts and the SDK shim
// is the kit's sdk/ts/makefun-bot.ts, vendored byte for byte.

import { runBot } from './vendor/makefun-bot.ts';
import { createStrategy, DEFAULT_PARAMS } from './strategy.ts';

await runBot(createStrategy(DEFAULT_PARAMS));
