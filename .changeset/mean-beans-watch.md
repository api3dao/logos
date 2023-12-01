---
'beta-logos': patch
---

SVG export is now available.

``` javascript
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
