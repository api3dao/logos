# Getting started

## Installation

[TEST DEPLOYMENT]

```bash
yarn add beta-logos
```

## Usage

```js
import { ChainLogo, SymbolLogo, ApiProviderLogo } from 'beta-logos';

<div>
    <img src={ChainLogo('43114')} width={50} height={50} alt='43114' />
    <img src={SymbolLogo('BTC')} width={50} height={50} alt='BTC' />
    <img src={ApiProviderLogo('nodary')} width={50} height={50} alt='nodary' />
</div>
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

## Supported chains and symbols

Visit [this page](https://api3dao.github.io/logos/) for a list of supported chains and symbols.

<!-- prettier-ignore-end -->
