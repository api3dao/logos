# Getting started

## Installation

[TEST DEPLOYMENT]

```bash
yarn add beta-logos
```

## Usage

```jsx
import React from 'react';
import { ChainLogo, SymbolLogo } from 'beta-logos';

const App = () => (
    <div>
        <ChainLogo id={'1'} width={50} height={50} />
        <SymbolLogo id={'BTC'} width={50} height={50} />
    </div>
);

export default App;
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
