# Getting started

## Installation

[TEST DEPLOYMENT]

```bash
yarn add beta-logos
```

## Usage

```jsx
import React from 'react';
import { ChainIcon, SymbolIcon } from 'beta-logos';

const App = () => (
    <div>
        <ChainIcon id={'1'} width={50} height={50} />
        <SymbolIcon id={'BTC'} width={50} height={50} />
    </div>
);

export default App;
```

## API

### ChainIcon

| Prop | Type   | Description |
| ---- | ------ | ----------- |
| id   | string | Chain id    |

### SymbolIcon

| Prop | Type   | Description |
| ---- | ------ | ----------- |
| id   | string | Symbol id   |

## Supported chains and symbols

Visit [this page](https://api3dao.github.io/logos/) for a list of supported chains and symbols.

<!-- prettier-ignore-end -->
