# @api3/logos

## 0.0.4

### Patch Changes

-   3601672: SVG export is now available.

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

-   ede55ad: Null check added

## 0.0.2

### Patch Changes

-   6a0ab5d: Change name

## 0.0.1

### Patch Changes

-   0ed4fd3: Test release
-   b1ab864: initial release
-   6f06f87: Test Release
