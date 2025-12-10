import axios from 'axios';
import type { Note } from '../types/note';
export type { Note };

const BASE_URL = 'https://notehub-public.goit.study/api';


const token = import.meta.env.VITE_NOTEHUB_TOKEN as string | undefined;
console.log("TOKEN FROM ENV:", token);

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

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
  page?: number;
  totalDocs?: number;
  limit?: number;
}


export const fetchNotes = async (params: FetchNotesParams): Promise<FetchNotesResponse> => {
  const { page = 1, perPage = 12, search } = params;
  const searchParam = search ? { search } : {};
  const res = await api.get<FetchNotesResponse>('/notes', {
    params: { page, perPage, ...searchParam },
  });
  console.log("FETCH NOTES RESPONSE:", res.data); 
  
  return res.data;
};

export const createNote = async (payload: { title: string; content?: string; tag: string }) => {
  const res = await api.post<Note>('/notes', payload);
  return res.data;
};

export const deleteNote = async (id: string) => {
  const res = await api.delete<{ deletedId?: string }>(`/notes/${id}`);
  return res.data;
};

