import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './Layout/Sidebar';
import Home from './Components/Home';
import SymbolsView from './Components/SymbolsView';
import ChainsView from './Components/ChainsView';
import ApiProviderView from './Components/ApiProviderView';
import MissingLogosView from './Components/MissingLogosView';
import ExtensionsView from './Components/ExtensionsView';
import Docs from './Components/Docs';

const App = () => {
    return (
        <HashRouter>
            <div className="app-shell">
                <Sidebar />
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/symbols" element={<SymbolsView />} />
                        <Route path="/chains" element={<ChainsView />} />
                        <Route path="/api-providers" element={<ApiProviderView />} />
                        <Route path="/missing-logos" element={<MissingLogosView />} />
                        <Route path="/extensions" element={<ExtensionsView />} />
                        <Route path="/docs" element={<Docs />} />
                    </Routes>
                </main>
            </div>
        </HashRouter>
    );
};

export default App;
