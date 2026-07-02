/* eslint-disable react/prop-types */
import React from 'react';
import { TbTriangleFilled, TbTriangleInvertedFilled } from 'react-icons/tb';
import { useState } from 'react';

const ExpandableView = ({ view, header, defaultState = false, size = 16 }) => {
    const [isOpen, setIsOpen] = useState(defaultState);

    return (
        <div className="flex-col text-left cursor-pointer shadow-md" style={{ padding: 8, width: '100%' }}>
            <div
                className="items-center"
                style={{ padding: 8, borderRadius: 2, backgroundColor: 'var(--color-gray-50)' }}
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center" style={{ gap: 12 }}>
                    <span style={{ fontWeight: 'bold', fontSize: size }}>{header}</span>
                    <div className="spacer" />
                    {isOpen ? (
                        <TbTriangleFilled size={'24px'} cursor={'pointer'} />
                    ) : (
                        <TbTriangleInvertedFilled size={'24px'} cursor={'pointer'} />
                    )}
                </div>
            </div>
            {isOpen ? view : null}
        </div>
    );
};

export default ExpandableView;
