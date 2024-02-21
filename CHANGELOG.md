# @api3/logos

## 2.9.2

### Patch Changes

- 0beed88: Add provenance check

## 2.9.1

### Patch Changes

- 66f2d1d: Some changes have been made to the `logos`.

  | Logo                                                            | Name      | Category     |
  | --------------------------------------------------------------- | --------- | ------------ |
  | <img src="./raw/api-providers/coingecko.svg" width="36" alt=""> | coingecko | api-provider |

## 2.9.0

### Minor Changes

- f1e0223: Light version support improved

## 2.8.5

### Patch Changes

- 8c45d99: # What's Changed
  Release created by the release script.
  Logos updated.

## 2.8.4

### Patch Changes

- fb4263a: # What's Changed
  Release created by the release script.
  Logos updated.

## 2.8.3

### Patch Changes

- e781776: # What's Changed
  Release created by the release script.
  Logos updated.

## 2.8.2

### Patch Changes

- 47337ac: Fixes optional parameter

## 2.8.1

### Patch Changes

- c69c97f: Fixed mEth logo

## 2.8.0

### Minor Changes

- 0ff4256: Light mode is implemented

## 2.7.0

### Minor Changes

- 2faedee: Logo designed synced with market

## 2.6.0

### Minor Changes

- c22c01f: Blast Sepolia Testnet added

## 2.5.0

### Minor Changes

- 1af67c6: New chain logos added;

  1. Lightlink (chain ID: 1890)
  2. LightLink Goerli Testnet (chain ID: 1891)

## 2.4.0

### Minor Changes

- b26653b: \`@nodary/utilities\` replaced with \`@phase21/api-integrations\`.

## 2.3.0

### Minor Changes

- e7ef4c3: New symbols are added.

  - `uniETH`
  - `osETH`
  - `weETH`
  - `PYUSD`
  - `WLD`

## 2.2.0

### Minor Changes

- a539166: Dependency update: `@phase21/chains`

## 2.1.0

### Minor Changes

- 6ccfa82: Update api-integrations to `@phase21/api-integrations`

## 2.0.0

### Major Changes

- f8cb93a: Package moved to phase21 organization

## 1.0.0

### Major Changes

- 3c328a1: Package name has been changed to `api3-logos` `api-integrations` package is updated

## 0.0.18

### Patch Changes

- c5d9628: - New logos added: ASTR, USDe, HG, INTC, DIS
  - Renovate config updated

## 0.0.17

### Patch Changes

- b6935b0: Dependency packages updated.

## 0.0.16

### Patch Changes

- 5b80f72: Update Polygon network logos

## 0.0.15

### Patch Changes

- 2cb7881: Move camelcase from devDependencies to dependencies

## 0.0.14

### Patch Changes

- bc0d03f:
  - Missing supported chains, symbols and logos will return a placeholder image instead of throwing an error.
  - Unsuppored chains, symbols and logos will return an error image.
  - A new tab added to frontend to display missing and chains, symbols and logos.

## 0.0.13

### Patch Changes

- 10139eb:
  - Added missing dependency (camelcase)

## 0.0.12

### Patch Changes

- a4195dc:
  - Release bug fixed

## 0.0.11

### Patch Changes

- a47a5a0:

  - React support removed.

  - `ChainLogo`, `SymbolLogo` and `ApiProviderLogo` now return a string instead of a React component.
  - Returned string is a base64 encoded SVG image.

  ```js
  import { ChainLogo, SymbolLogo, ApiProviderLogo } from "logos";

  <div>
    <img src={ChainLogo("43114")} width={50} height={50} alt="43114" />
    <img src={SymbolLogo("BTC")} width={50} height={50} alt="BTC" />
    <img src={ApiProviderLogo("nodary")} width={50} height={50} alt="nodary" />
  </div>;
  ```

## 0.0.10

### Patch Changes

- 8fd2486: Added new symbols; 'BABA', 'ETHx', 'MATICx', 'PYTH', 'WOO', 'MATIC Exchange Rate', 'NG', 'QQQ', 'PYPL'

  | Symbol Name         | Logo                                                                                                                          |
  | ------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
  | BABA                | <img src="https://raw.githubusercontent.com/api3dao/logos/main/raw/symbols/baba.svg" width="32" height="32" />                |
  | ETHx                | <img src="https://raw.githubusercontent.com/api3dao/logos/main/raw/symbols/et-hx.svg" width="32" height="32" />               |
  | MATICx              | <img src="https://raw.githubusercontent.com/api3dao/logos/main/raw/symbols/mati-cx.svg" width="32" height="32" />             |
  | PYTH                | <img src="https://raw.githubusercontent.com/api3dao/logos/main/raw/symbols/pyth.svg" width="32" height="32" />                |
  | WOO                 | <img src="https://raw.githubusercontent.com/api3dao/logos/main/raw/symbols/woo.svg" width="32" height="32" />                 |
  | MATIC Exchange Rate | <img src="https://raw.githubusercontent.com/api3dao/logos/main/raw/symbols/matic-exchange-rate.svg" width="32" height="32" /> |
  | NG                  | <img src="https://raw.githubusercontent.com/api3dao/logos/main/raw/symbols/ng.svg" width="32" height="32" />                  |
  | QQQ                 | <img src="https://raw.githubusercontent.com/api3dao/logos/main/raw/symbols/qqq.svg" width="32" height="32" />                 |
  | PYPL                | <img src="https://raw.githubusercontent.com/api3dao/logos/main/raw/symbols/pypl.svg" width="32" height="32" />                |

## 0.0.9

### Patch Changes

- a19b40e: Fix invalid import statement for cjs

## 0.0.8

### Patch Changes

- c797370: Added new symbols; mETH, EURE, GHO, RDNT

  | Symbol Name | Logo                                                                                                                                                |
  | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
  | mETH        | <img src="https://raw.githubusercontent.com/api3dao/logos/af94f6485ad28be135e6721169faa7f9be39fd52/raw/symbols/m-eth.svg" width="32" height="32" /> |
  | EURE        | <img src="https://raw.githubusercontent.com/api3dao/logos/af94f6485ad28be135e6721169faa7f9be39fd52/raw/symbols/eure.svg" width="32" height="32" />  |
  | GHO         | <img src="https://raw.githubusercontent.com/api3dao/logos/af94f6485ad28be135e6721169faa7f9be39fd52/raw/symbols/gho.svg" width="32" height="32" />   |
  | RDNT        | <img src="https://raw.githubusercontent.com/api3dao/logos/af94f6485ad28be135e6721169faa7f9be39fd52/raw/symbols/rdnt.svg" width="32" height="32" />  |

## 0.0.7

### Patch Changes

- de4bec0: Export functions fixed.

## 0.0.6

### Patch Changes

- f3149d9: Add example view.

## 0.0.5

### Patch Changes

- a835657: - JSDoc annotations added to `logos` package.

  - `logos` package now exports `Logo` as svg string.
  - `logos` package now exports `Logo` as React component.
  - Package size reduced.

  - Method names changed.

    - SVG component

      ```javascript
      ChainLogoSvg(id: string)
      SymbolLogoSvg(id: string)
      ApiProviderLogoSvg(id: string)
      ```

      ```html
      <img src={ChainLogoSvg('43114')} width={50} height={50} alt='' />
      <img src={SymbolLogoSvg('BTC')} width={50} height={50} alt='' />
      <img src={ApiProviderLogoSvg('nodary')} width={50} height={50} alt='' />
      ```

    - React component

      ```javascript
      ChainLogo(id: string)
      SymbolLogo(id: string)
      ApiProviderLogo(id: string)
      ```

      ```html
      <ChainLogo id="43114" width="{50}" height="{50}" />
      <SymbolLogo id="BTC" width="{50}" height="{50}" />
      <ApiProviderLogo id="nodary" width="{50}" height="{50}" />
      ```

## 0.0.4

### Patch Changes

- 3601672: SVG export is now available.

  ```javascript
  ChainIconBase64(id: string)
  SymbolIconBase64(id: string)
  ApiProviderLogoBase64(id: string)
  ```

  ```html
  <img src={ChainIconBase64('43114')} width={50} height={50} alt='' />
  <img src={SymbolIconBase64('BTC')} width={50} height={50} alt='' />
  <img src={ApiProviderLogoBase64('nodary')} width={50} height={50} alt='' />
  ```

  You can now call these functions to get svg file as base64 string.

## 0.0.3

### Patch Changes

- ede55ad: Null check added

## 0.0.2

### Patch Changes

- 6a0ab5d: Package name changed to @api3/logos

## 0.0.1

### Patch Changes

- 0ed4fd3: Test release
- b1ab864: initial release
- 6f06f87: Test Release
