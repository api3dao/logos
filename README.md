# Getting started

## Installation

```bash
pnpm add @phase21/logos
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

### ChainLogo

| Prop | Type   | Description |
| ---- | ------ | ----------- |
| id   | string | Chain id    |

### SymbolLogo

| Prop | Type   | Description |
| ---- | ------ | ----------- |
| id   | string | Symbol id   |
