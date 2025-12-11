import React from 'react';
import ReactPaginate from 'react-paginate';
import styles from './Pagination.module.css';

interface PaginationProps {
  page: number;
  onPageChange: (page: number) => void;
  pageCount?: number;
}

const Pagination: React.FC<PaginationProps> = ({ page, onPageChange, pageCount = 1 }) => {
  if (pageCount <= 1) return null;

  return (
    <ReactPaginate
      previousLabel={'←'}
      nextLabel={' →'}
      pageCount={pageCount}
      forcePage={page - 1}
      onPageChange={(selected) => onPageChange(selected.selected + 1)}
      containerClassName={styles.pagination}
      activeClassName={styles.active}
    />
  );
};

export default Pagination;