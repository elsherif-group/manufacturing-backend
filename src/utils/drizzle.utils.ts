import { text, integer, type AnySQLiteColumn } from 'drizzle-orm/sqlite-core';

export const boolean = (defaultValue: boolean = false) => integer({ mode: 'boolean' }).notNull().default(defaultValue);
export const uniquePrimaryKey = () => integer().primaryKey({ autoIncrement: true });
export const foreignKey = (column: AnySQLiteColumn) => integer().references(() => column, { onDelete: 'cascade' }).notNull();
export const integerNotNull = (defaultValue: number = 0) => integer().notNull().default(defaultValue);
export const textNotNull = () => text().notNull();
export const textUniqueNotNull = () => text().unique().notNull();