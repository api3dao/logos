/* eslint-disable react/prop-types */
import React from 'react';
import { TbSearch } from 'react-icons/tb';

const SearchRow = ({ text, setText, placeholder }) => {
    return (
        <div className="flex items-center" style={{ gap: 12, width: '100%' }}>
            <TbSearch size={'32px'} style={{ margin: 8 }} />

            <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={placeholder}
                style={{
                    color: 'black',
                    fontSize: 16,
                    flex: 1,
                    padding: '8px 12px',
                    border: '1px solid var(--color-gray-300)',
                    borderRadius: 4
                }}
            />
        </div>
    );
};

export default SearchRow;
