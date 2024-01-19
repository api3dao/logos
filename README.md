# Getting started

## Installation

```bash
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

### ChainLogo

| Prop | Type   | Description |
| ---- | ------ | ----------- |
| id   | string | Chain id    |

### SymbolLogo

| Prop | Type   | Description |
| ---- | ------ | ----------- |
| id   | string | Symbol id   |

## Package update

Run the following command to update the package:

```bash
yarn changeset
```

Then follow the instructions in the terminal:

```bash
🦋  What kind of change is this for logos? (current version is x.x.x)
❯ patch
  minor
  major
```

```bash
🦋  Please enter a summary for this change (this will be in the changelogs).
🦋    (submit empty line to open external editor)
🦋  Summary ›  [CHANGES]
```

After that, you will be asked to confirm the changeset:

```bash
🦋  Summary › [CHANGES]
🦋
🦋  === Summary of changesets ===
🦋  patch:  logos
🦋
🦋  Is this your desired changeset? (Y/n) › true
```

If you confirm, the changeset will be created and you will be asked to publish it:

```bash
🦋  Changeset added! - you can now commit it
🦋
🦋  If you want to modify or expand on the changeset summary, you can find it here
🦋  info .changeset/[MD_FILE]
✨  Done.
```

Commit the changeset and push it to the repository:

```bash
git add .
git commit -m "chore: update logos"
git push
```

Merge the changeset to the main branch:

```bash
git checkout main
git merge [BRANCH_NAME]
git push
```

To publish the package, merge main to the `production` branch:

```bash
git checkout production
git merge main
git push
```

Changeset will raise a PR to the `production` branch. After the PR is merged, the package will be published to npm.

## Supported chains and symbols

Visit [this page](https://api3dao.github.io/logos/) for a list of supported chains and symbols.

<!-- prettier-ignore-end -->
