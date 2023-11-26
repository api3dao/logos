# Getting started

## Installation

```bash
yarn add @api3/react-icons
```

## Usage

```jsx
import React from 'react';
import { ChainIcon, SymbolIcon } from '@api3/react-icons';

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

Visit [this page](https://api3dao.github.io/react-icons/) for a list of supported chains and symbols.

<!-- prettier-ignore-end -->
