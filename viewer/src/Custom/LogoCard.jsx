/* eslint-disable react/prop-types */
import React from 'react';

const LogoCard = ({ lightSrc, darkSrc, label, meta, onClick }) => {
    return (
        <div className="logo-card" onClick={onClick}>
            <div className="logo-card-thumbs">
                <div className="logo-card-thumb" style={{ backgroundColor: 'white' }}>
                    <img src={lightSrc} width={28} height={28} alt={label} />
                </div>
                <div className="logo-card-thumb" style={{ backgroundColor: 'black' }}>
                    <img src={darkSrc} width={28} height={28} alt={label} />
                </div>
            </div>
            <div className="flex-col" style={{ minWidth: 0 }}>
                <span className="logo-card-label">{label}</span>
                {meta ? <span className="logo-card-meta">{meta}</span> : null}
            </div>
        </div>
    );
};

export default LogoCard;
