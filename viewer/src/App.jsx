import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Header from './Components/Header';
import Welcome from './Components/Welcome';

const App = () => {
    return (
        <HashRouter>
            <Header />
            <div className="flex items-stretch" style={{ height: 'calc(100vh - 70px)', padding: 20 }}>
                <div className="flex-col items-center" style={{ width: '100%' }}>
                    <Routes>
                        <Route path="/" element={<Welcome />} />
                    </Routes>
                </div>
            </div>
        </HashRouter>
    );
};

export default App;
