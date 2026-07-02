/* eslint-disable react/no-children-prop */
/* eslint-disable react/prop-types */
import * as React from 'react';
import { ApiProviderLogo, SymbolLogo, ChainLogo } from '@api3/logos';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { xonokai } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { VscChromeClose } from 'react-icons/vsc';

const LogoView = (method, feed, isLight = false) => {
    if (method === 'Chain') {
        return <img src={ChainLogo(feed, isLight)} width={50} height={50} alt={feed} />;
    } else if (method === 'Symbol') {
        return <img src={SymbolLogo(feed, isLight)} width={50} height={50} alt={feed} />;
    } else if (method === 'ApiProvider') {
        return <img src={ApiProviderLogo(feed, isLight)} width={50} height={50} alt={feed} />;
    }
};

const InfoView = ({ method, feed, onExit }) => {
    return (
        <div
            className="flex items-center flex-wrap shadow-md"
            style={{ backgroundColor: 'var(--color-gray-300)', padding: 20, gap: 20, zIndex: 0 }}
        >
            <div
                className="flex items-center justify-start"
                style={{ padding: 8, backgroundColor: 'white', width: '100%' }}
            >
                {LogoView(method, feed, true)}
                <span style={{ fontSize: 16, fontWeight: 'bold', marginLeft: 8 }}> {feed} </span>
                <div className="spacer" />
                <VscChromeClose onClick={() => onExit(null)} cursor={'pointer'} style={{ cursor: 'pointer' }} />
            </div>
            <div className="flex-col justify-start text-left">
                <SyntaxHighlighter
                    PreTag="div"
                    children={String(
                        `<img \n\tsrc={${method}Logo('${feed}', true)}\n\twidth={50}\n\theight={50}\n/>`
                    ).replace(/\n$/, '')}
                    language={'javascript'}
                    style={xonokai}
                />
            </div>
            <div
                className="flex items-center justify-start"
                style={{ padding: 8, backgroundColor: 'black', width: '100%' }}
            >
                {LogoView(method, feed, false)}
                <span style={{ color: 'white', fontSize: 16, fontWeight: 'bold', marginLeft: 8 }}> {feed} </span>
                <div className="spacer" />
            </div>
            <div className="flex-col justify-start text-left">
                <SyntaxHighlighter
                    PreTag="div"
                    children={String(
                        `<img \n\tsrc={${method}Logo('${feed}')}\n\twidth={50}\n\theight={50}\n/>`
                    ).replace(/\n$/, '')}
                    language={'javascript'}
                    style={xonokai}
                />
            </div>
        </div>
    );
};

export default InfoView;
