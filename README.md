# Getting started

## Installation

```bash
pnpm add @phase21/logos
npm i @phase21/logos
yarn add @phase21/logos
```

## Usage

### React

```js
import { ChainLogo, SymbolLogo, ApiProviderLogo } from '@phase21/logos';

<div>
    <img src={ChainLogo('43114')} width={50} height={50} alt="43114" />
    <img src={SymbolLogo('BTC')} width={50} height={50} alt="BTC" />
    <img src={ApiProviderLogo('nodary')} width={50} height={50} alt="nodary" />
</div>;
```

### HTML

```html

<template>
    <div>
        <img src={ChainLogo('43114')} width={50} height={50} alt='43114' />
        <img src={SymbolLogo('BTC')} width={50} height={50} alt='BTC' />
        <img src={ApiProviderLogo('nodary')} width={50} height={50} alt='nodary' />
    </div>
</template>

<script>
import { ChainLogo, SymbolLogo, ApiProviderLogo } from '@phase21/logos';

export default {
...
methods: {
    getSymbolLogo(symbol) {
      return SymbolLogo(symbol);
    },
    getChainLogo(chainId) {
      return ChainLogo(chainId);
    },
    getApiProviderLogo(apiProvider) {
      return ApiProviderLogo(apiProvider);
    },
}
...
}
</script>
```

## API

`light` prop is optional and defaults to `false` (dark theme). `light = true` will return the light theme logo.

### ChainLogo

| Prop  | Type    | Description |
| ----- | ------- | ----------- |
| id    | string  | Chain id    |
| light | boolean | Light theme |

### SymbolLogo

| Prop  | Type    | Description |
| ----- | ------- | ----------- |
| id    | string  | Symbol id   |
| light | boolean | Light theme |

### ApiProviderLogo

| Prop  | Type    | Description |
| ----- | ------- | ----------- |
| id    | string  | ApiProvider |
| light | boolean | Light theme |

## Visit

Live demo at [https://api3dao.github.io/logos](https://api3dao.github.io/logos)
