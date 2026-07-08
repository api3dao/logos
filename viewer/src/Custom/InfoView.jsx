/* eslint-disable react/no-children-prop */
/* eslint-disable react/prop-types */
import * as React from 'react';
import { useEffect } from 'react';
import { ApiProviderLogo, SymbolLogo, ChainLogo } from '@api3/logos';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { xonokai } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { VscChromeClose } from 'react-icons/vsc';

const LogoView = (method, feed, isLight = false) => {
    if (method === 'Chain') {
        return <img src={ChainLogo(feed, isLight)} width={44} height={44} alt={feed} />;
    } else if (method === 'Symbol') {
        return <img src={SymbolLogo(feed, isLight)} width={44} height={44} alt={feed} />;
    } else if (method === 'ApiProvider') {
        return <img src={ApiProviderLogo(feed, isLight)} width={44} height={44} alt={feed} />;
    }
};

const InfoView = ({ method, feed, onExit }) => {
    useEffect(() => {
        const onKeyDown = (event) => {
            if (event.key === 'Escape') onExit(null);
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [onExit]);

    return (
        <div className="modal-backdrop" onMouseDown={() => onExit(null)}>
            <div className="modal-panel" onMouseDown={(event) => event.stopPropagation()}>
                <div className="modal-preview" style={{ backgroundColor: 'white' }}>
                    {LogoView(method, feed, true)}
                    <span className="modal-preview-label">{feed}</span>
                    <div className="spacer" />
                    <div className="modal-close" onClick={() => onExit(null)}>
                        <VscChromeClose />
                    </div>
                </div>
                <div className="modal-snippet">
                    <SyntaxHighlighter
                        PreTag="div"
                        customStyle={{ borderRadius: 8, margin: 0 }}
                        children={String(
                            `<img \n\tsrc={${method}Logo('${feed}', true)}\n\twidth={50}\n\theight={50}\n/>`
                        ).replace(/\n$/, '')}
                        language={'javascript'}
                        style={xonokai}
                    />
                </div>
                <div className="modal-preview" style={{ backgroundColor: 'black' }}>
                    {LogoView(method, feed, false)}
                    <span className="modal-preview-label" style={{ color: 'white' }}>
                        {feed}
                    </span>
                    <div className="spacer" />
                </div>
                <div className="modal-snippet">
                    <SyntaxHighlighter
                        PreTag="div"
                        customStyle={{ borderRadius: 8, margin: 0 }}
                        children={String(`<img \n\tsrc={${method}Logo('${feed}')}\n\twidth={50}\n\theight={50}\n/>`).replace(
                            /\n$/,
                            ''
                        )}
                        language={'javascript'}
                        style={xonokai}
                    />
                </div>
            </div>
        </div>
    );
};

export default InfoView;
