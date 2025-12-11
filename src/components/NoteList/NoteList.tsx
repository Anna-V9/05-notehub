import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchNotes, deleteNote } from '../../services/noteService';
import type { FetchNotesResponse, Note } from '../../services/noteService';
import styles from './NoteList.module.css';

interface NoteListProps {
  page: number;
  perPage: number;
  search?: string;
  onPageCount: (count: number) => void;
}

const NoteList: React.FC<NoteListProps> = ({
  page,
  perPage,
  search,
  onPageCount
}) => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery<FetchNotesResponse>({
    queryKey: ['notes', { page, perPage, search }],
    queryFn: () => fetchNotes({ page, perPage, search }),
    staleTime: 5000,
  });

  React.useEffect(() => {
    if (data?.totalPages) {
      onPageCount(data.totalPages);
    }
  }, [data, onPageCount]);

  const handleDelete = async (id: string) => {
    await deleteNote(id);
    queryClient.invalidateQueries({ queryKey: ['notes'] });
  };

  if (isLoading) return <div className={styles.loader}>Loading...</div>;
  if (isError) return <div className={styles.error}>Something went wrong</div>;
  if (!data?.notes) return null;

  return (
    <ul className={styles.list}>
      {data.notes.map((note: Note) => (
        <li key={note._id} className={styles.listItem}>
          <h2 className={styles.title}>{note.title}</h2>
          <p className={styles.content}>{note.content}</p>
          <div className={styles.footer}>
            <span className={styles.tag}>{note.tag}</span>
            <button className={styles.button} onClick={() => handleDelete(note._id)}>
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default NoteList;