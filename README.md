# Pump.fun Paper Sprint — Sprint bot

A paper-trading bot for the make.fun **Pump.fun Paper Sprint: Any Bot Can Win**
competition (`u-boothlord-pump-fun-paper-sprint-any-bot-can-f83c389b`, harness
`pumpfun-replay/v2`). One program at `main.ts` (Node 22), no real money, no real
SOL — the house replays it on 6 hours of pump.fun bonding-curve data and ranks
by net PnL.

## Strategy

Late-stage completion-leg momentum, tuned on the kit's dev window:

- **Entry:** a curve already holding 15–85 SOL of real reserves, up 15%+ over the
  last 40 slots, with 5+ SOL of net inflow over that window, the newer half of
  the inflow at least 2x the older half (accelerating), from 8+ distinct buyers,
  price within 15% of the window high. One fixed-size buy per coin (up to
  0.4 SOL, capped at 70% of the 1%-of-real-reserves order cap).
- **Exits:** a tight 3% stop loss (pump.fun legs dump as fast as they run), a
  wide 175% take-profit so a moonshot can pay, and a 3000-slot (~20 min) time
  cap. The replay closes positions when a curve completes.
- **No pyramiding:** adding into strength tripled the wins but quintupled the
  bleed on the dev window, so every entry risks one fixed stake.
- **Guardrail probes:** if filled coins lag the pace (25 coins / 240 fills over
  6h), the bot opens a 0.01 SOL probe round trip on a liquid curve.

Why this shape: the replay's 2-slot latency kills chasing single-trade pumps —
by the time an order fills, the spike has already reverted. The only moves that
survive latency are the big ones, and the completion leg (a curve needs 85 SOL
to complete) is the most reliable up-move in the data. The tight stop keeps the
bleed per dud small; the wide take-profit lets the rare 10x runner pay for the
duds.

## Files

- `main.ts` — entrypoint: runs the strategy through the kit SDK.
- `strategy.ts` — the strategy (all logic, parameters in `DEFAULT_PARAMS`).
- `vendor/makefun-bot.ts` — the kit's `sdk/ts/makefun-bot.ts`, vendored byte
  for byte.
- `tools/` — offline backtest harness (uses the kit pilot's local engine port;
  not part of the entry).

## Local validation

Against the kit's dev window with the local replay engine:

- Kit sim window (first ~11h): **net +0.572934 SOL**, 286 fills, 84 coins,
  143 trips, 14 wins, max drawdown 0.0548. Top coins: EMr3aF +0.382, GiupJo
  +0.352, 5NptBs +0.351 SOL.
- Full 24h dev window (all three dataset parts): net −0.411576 SOL, 514 fills,
  198 coins, 257 trips, 23 wins, max drawdown 0.1228. The 24h window is harder:
  the same three moonshots pay +0.35 SOL each, but the extra 12h adds ~114 more
  losing trips. The final 6h window is a fresh draw — the bot is built to catch
  the window's runners, not to grind the dev sample.

## License

MIT — see `LICENSE`.
