import React from 'react';

// eslint-disable-next-line react/prop-types
const Title = ({ header, fontWeight = 300, p = 12 }) => {
    return (
        <div className="flex-col text-left" style={{ padding: p, width: '100%' }}>
            <div className="flex items-center" style={{ borderBottom: '1px solid #000' }}>
                <span style={{ fontWeight, fontSize: 24 }}>{header}</span>
            </div>
        </div>
    );
};

export default Title;
