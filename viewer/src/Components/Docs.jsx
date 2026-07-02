/* eslint-disable react/no-children-prop */
import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ChainLogo, SymbolLogo, ApiProviderLogo } from '@api3/logos';

const Docs = () => {
    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">How to use</h1>
                <p className="page-subtitle">
                    Usage of the ChainLogo, SymbolLogo and ApiProviderLogo helpers exported from @api3/logos.
                </p>
            </div>

            <h2 className="section-heading">Installation</h2>
            <div className="doc-codeblock">
                <SyntaxHighlighter
                    PreTag="div"
                    customStyle={{ margin: 0 }}
                    children={String('npm install @api3/logos')}
                    language={'bash'}
                    style={dracula}
                />
            </div>

            <h2 className="section-heading">Usage React</h2>
            <div className="doc-codeblock">
                <SyntaxHighlighter
                    PreTag="div"
                    customStyle={{ margin: 0 }}
                    children={String(`import { ChainLogo, SymbolLogo, ApiProviderLogo } from '@api3/logos';

<div>
    <img src={ ChainLogo('43114') } width={50} height={50} alt='43114' />
    <img src={ SymbolLogo('BTC') } width={50} height={50} alt='BTC' />
    <img src={ ApiProviderLogo('nodary') } width={50} height={50} alt='nodary' />
</div>`)}
                    language={'jsx'}
                    style={dracula}
                />
            </div>
            <div className="doc-preview">
                <img src={ChainLogo('43114')} width={50} height={50} alt="43114" />
                <img src={SymbolLogo('BTC')} width={50} height={50} alt="BTC" />
                <img src={ApiProviderLogo('nodary')} width={50} height={50} alt="nodary" />
            </div>

            <h2 className="section-heading">Light/Dark mode</h2>
            <div className="doc-codeblock">
                <SyntaxHighlighter
                    PreTag="div"
                    customStyle={{ margin: 0 }}
                    children={String(`import { ChainLogo, SymbolLogo, ApiProviderLogo } from '@api3/logos';

<div>
    <img src={ ChainLogo('59144', true) } width={50} height={50} />
    <img src={ ChainLogo('59144') } width={50} height={50} />
</div>`)}
                    language={'jsx'}
                    style={dracula}
                />
            </div>
            <div className="doc-preview">
                <img src={ChainLogo('59144', true)} width={50} height={50} />
                <img src={ChainLogo('59144')} width={50} height={50} />
            </div>

            <h2 className="section-heading">Usage Vue.js</h2>
            <div className="doc-codeblock">
                <SyntaxHighlighter
                    PreTag="div"
                    customStyle={{ margin: 0 }}
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
            </div>
            <div className="doc-preview">
                <img src={SymbolLogo('eth')} width={50} height={50} />
                <img src={ChainLogo('1')} width={50} height={50} />
                <img src={ApiProviderLogo('nodary')} width={50} height={50} />
            </div>

            <h2 className="section-heading">Usage Nuxt/Vue.js</h2>

            <p className="doc-subheading">Create a logos.ts in plugins folder;</p>
            <div className="doc-codeblock">
                <SyntaxHighlighter
                    PreTag="div"
                    customStyle={{ margin: 0 }}
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
            </div>

            <p className="doc-subheading">Define the plugin in nuxt.config file;</p>
            <div className="doc-codeblock">
                <SyntaxHighlighter
                    PreTag="div"
                    customStyle={{ margin: 0 }}
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
            </div>

            <p className="doc-subheading">Call it from your .vue file;</p>
            <div className="doc-codeblock">
                <SyntaxHighlighter
                    PreTag="div"
                    customStyle={{ margin: 0 }}
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
            </div>
            <div className="doc-preview">
                <img src={ChainLogo('1')} width={50} height={50} />
                <img src={SymbolLogo('btc')} width={50} height={50} />
                <img src={ApiProviderLogo('nodary')} width={50} height={50} />
            </div>
        </div>
    );
};

export default Docs;
