import axios from 'axios';
import type { Note } from '../types/note';

const BASE_URL = 'https://notehub-public.goit.study/api';

const token = import.meta.env.VITE_NOTEHUB_TOKEN as string | undefined;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json',
  },
});

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
}

// ✅ Тепер експортуємо
export interface NotesResponse {
  docs: Note[];
  totalDocs?: number;
  limit?: number;
  page?: number;
  totalPages?: number;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
}

export const fetchNotes = async (
  params: FetchNotesParams
): Promise<NotesResponse> => {
  const { page = 1, perPage = 12, search } = params;

  const res = await api.get<{
    notes: Note[];
    totalDocs?: number;
    limit?: number;
    page?: number;
    totalPages?: number;
  }>('/notes', {
    params: { page, perPage, ...(search ? { search } : {}) },
  });

  return {
    docs: res.data.notes,
    totalDocs: res.data.totalDocs,
    limit: res.data.limit,
    page: res.data.page,
    totalPages: res.data.totalPages,
  };
};

export const createNote = async (
  payload: { title: string; content?: string; tag: string }
): Promise<Note> => {
  const res = await api.post<Note>('/notes', payload);
  return res.data;
};

export const deleteNote = async (id: string): Promise<void> => {
  await api.delete(`/notes/${id}`);
};