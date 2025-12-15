import React, { useState, useEffect, useMemo } from 'react';
import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import debounce from 'lodash.debounce';

import SearchBox from '../SearchBox/SearchBox';
import NoteList from '../NoteList/NoteList';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';
import Pagination from '../Pagination/Pagination';

import { fetchNotes } from '../../services/noteService';
import type { NotesResponse } from '../../services/noteService';

import styles from './App.module.css';

const AppContent: React.FC = () => {
  const [page, setPage] = useState(1);
  const [perPage] = useState(12);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);

  const debouncedSetSearch = useMemo(
    () =>
      debounce((value: string) => {
        setPage(1);
        setDebouncedSearch(value);
      }, 500),
    []
  );

  useEffect(() => {
    return () => {
      debouncedSetSearch.cancel();
    };
  }, [debouncedSetSearch]);

  const queryOptions: UseQueryOptions<NotesResponse, Error> = {
    queryKey: ['notes', { page, perPage, search: debouncedSearch }],
    queryFn: () => fetchNotes({ page, perPage, search: debouncedSearch }),
    placeholderData: (prev) => prev,
  };

  const { data, isLoading, isError } = useQuery(queryOptions);

  const notes = data?.docs ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className={styles.app}>
      <header className={styles.toolbar}>
        <SearchBox onSearch={debouncedSetSearch} />

        <Pagination
          page={page}
          onPageChange={setPage}
          totalPages={totalPages}
        />

        <button
          className={styles.button}
          onClick={() => setModalOpen(true)}
        >
          Create note +
        </button>
      </header>

      <main>
        {isLoading && <p>Loading...</p>}
        {isError && <p>Error loading notes</p>}

        {!isLoading && !isError && <NoteList notes={notes} />}
      </main>

      {isModalOpen && (
        <Modal onClose={() => setModalOpen(false)}>
          <NoteForm
            onSuccess={() => setModalOpen(false)}
            onCancel={() => setModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
};

export default AppContent;