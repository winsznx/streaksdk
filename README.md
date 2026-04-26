# StreakSDK

A professional TypeScript SDK for interacting with the Stacks habit-tracking smart contracts.

## Installation

```bash
npm install @winsznx/streaksdk
```

## Quick Start

```typescript
import { StreakClient } from '@winsznx/streaksdk';

const client = new StreakClient({
    network: 'testnet',
    contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
    contractName: 'habit-registry'
});

// Fetch live state for a user
const state = await client.getLiveState('ST2J8EVYHP1N7Y2D0Q0R4M9A7V2S2W5N1D0R7STREAK');
console.log(`Current Streak: ${state.streak}`);
console.log(`Multiplier: ${state.liveMultiplier}x`);

// Submit an action
await client.submitAction('check-in', 'YOUR_PRIVATE_KEY', [1]);
```

## Features

- **Class-based Client**: Easy to initialize and use.
- **Live State**: Automatically computes metrics like streak decay and multipliers.
- **Type Safe**: Full TypeScript support with strictly defined interfaces.
- **Dual Bundle**: Ships in both ESM and CJS formats.
