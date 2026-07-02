/* eslint-disable react/no-children-prop */
import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ChainLogo, SymbolLogo, ApiProviderLogo } from '@api3/logos';

const ChainsView = () => {
    return (
        <div
            className="flex-col text-left"
            style={{ padding: 12, gap: 12, backgroundColor: 'white', width: '100%', overflow: 'scroll' }}
        >
            <span style={{ fontSize: 16, fontWeight: 'bold', marginLeft: 8 }}>
                Usage of ChainLogo and SymbolLogo components
            </span>
            <span style={{ fontSize: 16, marginLeft: 8 }}>
                You can use ChainLogo and SymbolLogo by importing them from @api3/logos package
            </span>

            <span style={{ fontSize: 20, fontWeight: 'bold', marginLeft: 8 }}>Installation</span>
            <SyntaxHighlighter
                PreTag="div"
                children={String('npm install @api3/logos')}
                language={'bash'}
                style={dracula}
            />
            <span style={{ fontSize: 20, fontWeight: 'bold', marginLeft: 8 }}>Usage React</span>
            <SyntaxHighlighter
                PreTag="div"
                children={String(`import { ChainLogo, SymbolLogo, ApiProviderLogo } from '@api3/logos';

<div>
    <img src={ ChainLogo('43114') } width={50} height={50} alt='43114' />
    <img src={ SymbolLogo('BTC') } width={50} height={50} alt='BTC' />
    <img src={ ApiProviderLogo('nodary') } width={50} height={50} alt='nodary' />
</div>`)}
                language={'jsx'}
                style={dracula}
            />

            <div className="flex flex-wrap items-center justify-start" style={{ padding: 12, gap: 12, backgroundColor: 'var(--color-gray-100)' }}>
                <img src={ChainLogo('43114')} width={50} height={50} alt="43114" />
                <img src={SymbolLogo('BTC')} width={50} height={50} alt="BTC" />
                <img src={ApiProviderLogo('nodary')} width={50} height={50} alt="nodary" />
            </div>

            <span style={{ fontSize: 20, fontWeight: 'bold', marginLeft: 8 }}>
                Light/Dark mode
            </span>

            <SyntaxHighlighter
                PreTag="div"
                children={String(`import { ChainLogo, SymbolLogo, ApiProviderLogo } from '@api3/logos';

<div>
    <img src={ ChainLogo('59144', true) } width={50} height={50} />
    <img src={ ChainLogo('59144') } width={50} height={50} />
</div>`)}
                language={'jsx'}
                style={dracula}
            />

            <div className="flex flex-wrap items-center justify-start" style={{ padding: 12, gap: 12, backgroundColor: 'var(--color-gray-100)' }}>
                <img src={ChainLogo('59144', true)} width={50} height={50} />
                <img src={ChainLogo('59144')} width={50} height={50} />
            </div>
            <span style={{ fontSize: 20, fontWeight: 'bold', marginLeft: 8 }}>
                Usage Vue.js
            </span>
            <SyntaxHighlighter
                PreTag="div"
                children={String(`<template>
    <div>
        <img v-bind:src="getSymbolLogo('eth')" alt="eth" />
        <img v-bind:src="getChainLogo('1')" alt="1" />
        <img v-bind:src="getApiProviderLogo('nodary')" alt="nodary" />
    </div>
</template>

<script>

import { ChainLogo, SymbolLogo, ApiProviderLogo } from '@api3/logos';
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
</script>`)}
                language={'html'}
                style={dracula}
            />
            <div className="flex flex-wrap items-center justify-start" style={{ padding: 12, gap: 12, backgroundColor: 'var(--color-gray-100)' }}>
                <img src={SymbolLogo('eth')} width={50} height={50} />
                <img src={ChainLogo('1')} width={50} height={50} />
                <img src={ApiProviderLogo('nodary')} width={50} height={50} />
            </div>
            <span style={{ fontSize: 20, fontWeight: 'bold', marginLeft: 8 }}>
                Usage Nuxt/Vue.js
            </span>

            <span style={{ fontSize: 18, fontWeight: 'bold', marginLeft: 8 }}>
                Create a logos.ts in plugins folder;
            </span>
            <SyntaxHighlighter
                PreTag="div"
                children={String(`import { ChainLogo, SymbolLogo, ApiProviderLogo } from "@api3/logos"

export default defineNuxtPlugin(() => {
    return {
        provide: {
            chainLogo: (chainId: string) => ChainLogo(chainId),
            symbolLogo: (symbol: string) => SymbolLogo(symbol),
            apiProviderLogo: (provider: string) => ApiProviderLogo(provider),
        }
    }
})`)}
                language={'typescript'}
                style={dracula}
            />
            <span style={{ fontSize: 18, fontWeight: 'bold', marginLeft: 8 }}>
                Define the plugin in nuxt.config file;
            </span>
            <SyntaxHighlighter
                PreTag="div"
                children={String(`// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  devtools: { enabled: true },
  build: {
    transpile: ['@api3/logos'],
  },
  plugins: [
    '~/plugins/logos',
  ],
})`)}
                language={'typescript'}
                style={dracula}
            />
            <span style={{ fontSize: 18, fontWeight: 'bold', marginLeft: 8 }}>
                Call it from your .vue file;
            </span>
            <SyntaxHighlighter
                PreTag="div"
                children={String(`<script setup lang="ts">
const { $chainLogo, $symbolLogo, $apiProviderLogo } = useNuxtApp()
</script>

<template>
  <div>
    <img v-bind:src="$chainLogo('1')" alt="eth" width="50px" height="50px" />
    <img v-bind:src="$symbolLogo('btc')" alt="btc" width="50px" height="50px" />
    <img v-bind:src="$apiProviderLogo('nodary')" alt="nodary" width="50px" height="50px" />

  </div>
</template>`)}
                language={'html'}
                style={dracula}
            />

            <div className="flex flex-wrap items-center justify-start" style={{ padding: 12, gap: 12, backgroundColor: 'var(--color-gray-100)' }}>
                <img src={ChainLogo('1')} width={50} height={50} />
                <img src={SymbolLogo('btc')} width={50} height={50} />
                <img src={ApiProviderLogo('nodary')} width={50} height={50} />
            </div>
        </div>
    );
};

export default ChainsView;
