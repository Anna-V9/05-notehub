import React from 'react';
import ReactPaginate from 'react-paginate';
import styles from './Pagination.module.css';

interface PaginationProps {
  page: number;
  onPageChange: (page: number) => void;
  totalPages: number; 
}

const Pagination: React.FC<PaginationProps> = ({ page, onPageChange, totalPages }) => {
  if (totalPages <= 1) return null;

  return (
    <ReactPaginate
      previousLabel={'←'}
      nextLabel={'→'}
      pageCount={totalPages} 
      forcePage={page - 1}
      onPageChange={(selected) => onPageChange(selected.selected + 1)}
      containerClassName={styles.pagination}
      activeClassName={styles.active}
    />
  );
};

export default Pagination;