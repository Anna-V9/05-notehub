import React, { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import styles from './SearchBox.module.css';

interface SearchBoxProps {
  onSearch: (search: string) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ onSearch }) => {
  const [value, setValue] = useState('');
  const [debounced] = useDebounce(value, 500); 

  useEffect(() => {
    onSearch(debounced);
  }, [debounced, onSearch]);

  return (
    <input
      className={styles.input}
      type="text"
      placeholder="Search notes"
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};

export default SearchBox;