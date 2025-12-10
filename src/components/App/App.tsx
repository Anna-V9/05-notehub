import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SearchBox from '../SearchBox/SearchBox';
import Pagination from '../Pagination/Pagination';
import NoteList from '../NoteList/NoteList';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';
import styles from './App.module.css';

const queryClient = new QueryClient();
const App: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [perPage] = useState<number>(12);
  const [search, setSearch] = useState<string>('');
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <div className={styles.app}>
        <header className={styles.toolbar}>
          <SearchBox onSearch={setSearch} />
          <Pagination page={page} onPageChange={setPage} />
          <button className={styles.button} onClick={() => setModalOpen(true)}>
            Create note +
          </button>
        </header>

        <main>
          <NoteList page={page} perPage={perPage} search={search} />
        </main>

        {isModalOpen && (
          <Modal onClose={() => setModalOpen(false)}>
            <NoteForm onSuccess={() => { setModalOpen(false);  }} />
          </Modal>
        )}
      </div>
    </QueryClientProvider>
  );
};

export default App;