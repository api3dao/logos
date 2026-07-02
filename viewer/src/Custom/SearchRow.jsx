/* eslint-disable react/prop-types */
import React from 'react';
import { TbSearch } from 'react-icons/tb';

const SearchRow = ({ text, setText, placeholder }) => {
    return (
        <div className="search-bar">
            <TbSearch size={18} color="var(--color-text-muted)" />
            <input value={text} onChange={(e) => setText(e.target.value)} placeholder={placeholder} />
        </div>
    );
};

export default SearchRow;
