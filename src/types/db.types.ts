import { ACTIONS, TABLES } from '@/constants/db.constants';

export type Table = (typeof TABLES)[number];
export type CrudAction = (typeof ACTIONS)[number];
export type Permission = `${Table}:${CrudAction}`;