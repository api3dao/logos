---
'beta-logos': patch
---

- React support removed.
- `ChainLogo`, `SymbolLogo` and `ApiProviderLogo` now return a string instead of a React component.
- Returned string is a base64 encoded SVG image.

```js
import { ChainLogo, SymbolLogo, ApiProviderLogo } from 'beta-logos';

<div>
    <img src={ChainLogo('43114')} width={50} height={50} alt='43114' />
    <img src={SymbolLogo('BTC')} width={50} height={50} alt='BTC' />
    <img src={ApiProviderLogo('nodary')} width={50} height={50} alt='nodary' />
</div>
```