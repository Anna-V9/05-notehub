import React, { useState, useEffect, useMemo } from 'react';
import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from '@tanstack/react-query';
import debounce from 'lodash.debounce';
import SearchBox from '../SearchBox/SearchBox';
import NoteList from '../NoteList/NoteList';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';
import Pagination from '../Pagination/Pagination';
import { fetchNotes, deleteNote } from '../../services/noteService';
import type { NotesResponse } from '../../types/note';
import styles from './App.module.css';

const AppContent: React.FC = () => {
  const [page, setPage] = useState(1);
  const [perPage] = useState(12);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);

  const queryClientInstance = useQueryClient();

  const debouncedSetSearch = useMemo(
    () =>
      debounce((value: string) => {
        setPage(1);
        setDebouncedSearch(value);
      }, 500),
    []
  );

  useEffect(() => {
    return () => debouncedSetSearch.cancel();
  }, [debouncedSetSearch]);

  const queryOptions: UseQueryOptions<NotesResponse, Error> = {
    queryKey: ['notes', { page, perPage, search: debouncedSearch }],
    queryFn: () => fetchNotes({ page, perPage, search: debouncedSearch }),
    placeholderData: (prev) => prev,
  };

  const { data, isLoading, isError } = useQuery(queryOptions);

  const notes = data?.docs ?? [];
  const totalPages = data?.totalPages ?? 1;

  const mutationDelete = useMutation<void, Error, string>({
    mutationFn: (id: string) => deleteNote(id).then(() => undefined),
    onSuccess: () =>
      queryClientInstance.invalidateQueries({ queryKey: ['notes'] }),
  });

  return (
    <div className={styles.app}>
      <header className={styles.toolbar}>
        <SearchBox onSearch={(value) => debouncedSetSearch(value)} />
        <Pagination page={page} onPageChange={setPage} totalPages={totalPages} />
        <button className={styles.button} onClick={() => setModalOpen(true)}>
          Create note +
        </button>
      </header>

      <main>
        {isLoading && <p>Loading...</p>}
        {isError && <p>Error loading notes</p>}

        {!isLoading && !isError && (
          <NoteList notes={notes} onDelete={(id) => mutationDelete.mutate(id)} />
        )}
      </main>

      {isModalOpen && (
        <Modal onClose={() => setModalOpen(false)}>
          <NoteForm onSuccess={() => setModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
};

export default AppContent;