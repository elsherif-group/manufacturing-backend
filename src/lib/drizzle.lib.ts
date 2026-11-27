import { Table } from '@/types/db.types';
import type { BuildColumns } from 'drizzle-orm';
import { sql } from 'drizzle-orm';
import { toSnakeCase } from 'drizzle-orm/casing';
import {
  check,
  integer,
  sqliteTable,
  text,
  type AnySQLiteColumn,
  type SQLiteColumn,
  type SQLiteColumnBuilderBase,
  type SQLiteTableExtraConfigValue
} from 'drizzle-orm/sqlite-core';

/**
 * An auto-incrementing integer primary key. A deleted row's id is never reused.
 *
 * @example
 * id: id()
 *
 * SQL output:
 * ```sql
 * `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL
 * ```
 */
export const id = () => integer().primaryKey({ autoIncrement: true });

/**
 * A required boolean, stored as an integer (0 or 1).
 *
 * @param defaultValue - The value used when none is given. Defaults to `false`.
 *
 * @example
 * isHighlighted: boolean()
 *
 * SQL output:
 * ```sql
 * `is_highlighted` integer DEFAULT false NOT NULL
 * ```
 */
export const boolean = (defaultValue: boolean = false) => integer({ mode: 'boolean' }).notNull().default(defaultValue);

/**
 * A required integer that references another table's column.
 * Deleting the referenced row also deletes this row.
 *
 * @param column - The column to reference, usually another table's `id`.
 *
 * @example
 * projectId: foreignKey(projectsTable.id)
 *
 * SQL output:
 * ```sql
 * `project_id` integer NOT NULL,
 * FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade
 * ```
 */
export const foreignKey = (column: AnySQLiteColumn) => integer().references(() => column, { onDelete: 'cascade' }).notNull();

/**
 * A required integer.
 *
 * @param defaultValue - The value used when none is given. Defaults to `0`.
 *
 * @example
 * sortOrder: integerNotNull()
 *
 * SQL output:
 * ```sql
 * `sort_order` integer DEFAULT 0 NOT NULL
 * ```
 */
export const integerNotNull = (defaultValue: number = 0) => integer().notNull().default(defaultValue);

/**
 * A required text column. Inside {@link createTable} it also can't be blank (see {@link notBlank}).
 *
 * @example
 * titleAr: textNotNull()
 *
 * SQL output:
 * ```sql
 * `title_ar` text NOT NULL
 * ```
 */
export const textNotNull = () => text().notNull();

/**
 * A required text column whose values must be unique across the table.
 * Inside {@link createTable} it also can't be blank (see {@link notBlank}).
 *
 * @example
 * slug: textUniqueNotNull()
 *
 * SQL output:
 * ```sql
 * `slug` text NOT NULL
 * CREATE UNIQUE INDEX `products_slug_unique` ON `products` (`slug`);
 * ```
 */
export const textUniqueNotNull = () => text().unique().notNull();

/**
 * The time the row was inserted. SQLite fills it in, so you never pass it.
 * Stored as seconds since 1970 (UTC); Drizzle reads it back as a `Date`.
 *
 * @example
 * createdAt: createdAt()
 *
 * SQL output:
 * ```sql
 * `created_at` integer DEFAULT (unixepoch()) NOT NULL
 * ```
 */
export const createdAt = () => integer({ mode: 'timestamp' }).notNull().default(sql`(unixepoch())`);

/**
 * The time the row was last changed. Starts as the insert time, and Drizzle sets it
 * to now on every update it runs. Updates made with raw SQL don't change it.
 * Stored as seconds since 1970 (UTC); Drizzle reads it back as a `Date`.
 *
 * @example
 * updatedAt: updatedAt()
 *
 * SQL output:
 * ```sql
 * `updated_at` integer DEFAULT (unixepoch()) NOT NULL
 * ```
 */
export const updatedAt = () => createdAt().$onUpdate(() => new Date());

/**
 * A check rule for one column.
 * Returns a CHECK constraint for columns it applies to, or `undefined` to skip the column.
 */
type ColumnCheckFunction = (name: string, column: SQLiteColumn) => ReturnType<typeof check> | undefined;

/**
 * Runs `columnCheck` on every column of a table and collects the constraints it returns.
 * Columns the check skips (returns `undefined` for) are left out.
 *
 * @param table - The table's columns, keyed by their property name.
 * @param columnCheck - The rule to run on each column, e.g. {@link notBlank}.
 * @returns The CHECK constraints, ready to spread into a table's extra config.
 *
 * @example
 * sqliteTable('users', { name: text().notNull(), bio: text() }, (table) => [
 *   ...checkEachColumn(table, notBlank)
 * ]);
 *
 * SQL output (one constraint per matching column; `bio` is nullable, so it is skipped):
 * ```sql
 * CONSTRAINT "name_not_blank" CHECK(length(trim("users"."name", ' ' || char(9, 10, 13))) > 0)
 * ```
 */
export const checkEachColumn = (table: Record<string, SQLiteColumn>, columnCheck: ColumnCheckFunction) => {
  return Object.entries(table).flatMap(([name, column]) => columnCheck(name, column) ?? []);
};

/**
 * Rejects empty or whitespace-only values in required text columns.
 * Spaces, tabs, newlines and carriage returns count as whitespace.
 * Skips nullable and non-text columns.
 *
 * The constraint is named `<column_name>_not_blank`, e.g. `title_ar_not_blank`.
 *
 * @param name - The column's property name (camelCase).
 * @param column - The column to check.
 *
 * @example
 * notBlank('titleAr', productsTable.titleAr)
 *
 * SQL output:
 * ```sql
 * CONSTRAINT "title_ar_not_blank" CHECK(length(trim("products"."title_ar", ' ' || char(9, 10, 13))) > 0)
 * ```
 */
export const notBlank: ColumnCheckFunction = (name, column) => {
  if (column.dataType === 'string' && column.notNull) {
    return check(`${toSnakeCase(name)}_not_blank`, sql`length(trim(${column}, ' ' || char(9, 10, 13))) > 0`);
  }
};

/**
 * Same as `sqliteTable`, but every required text column also gets a {@link notBlank} check.
 *
 * @param name - The table name in the database.
 * @param columns - The table's columns.
 * @param extraConfig - Your own constraints and indexes, same as `sqliteTable`'s third argument.
 *
 * @example
 * export const productsTable = createTable('products', {
 *   id: id(),
 *   slug: textUniqueNotNull(),
 *   sortOrder: integerNotNull()
 * }, ({ sortOrder }) => [
 *   check('sort_order_positive', sql`${sortOrder} >= 0`)
 * ]);
 *
 * SQL output:
 * ```sql
 * CREATE TABLE `products` (
 *   `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
 *   `slug` text NOT NULL,
 *   `sort_order` integer DEFAULT 0 NOT NULL,
 *   CONSTRAINT "sort_order_positive" CHECK("products"."sort_order" >= 0),
 *   CONSTRAINT "slug_not_blank" CHECK(length(trim("products"."slug", ' ' || char(9, 10, 13))) > 0)
 * );
 * CREATE UNIQUE INDEX `products_slug_unique` ON `products` (`slug`);
 * ```
 */
export const createTable = <TName extends Table, TColumns extends Record<string, SQLiteColumnBuilderBase>>(
  name: TName,
  columns: TColumns,
  extraConfig?: (table: BuildColumns<TName, TColumns, 'sqlite'>) => SQLiteTableExtraConfigValue[]
) => {
  return sqliteTable(name, columns, (table) => [
    ...(extraConfig?.(table) ?? []),
    ...checkEachColumn(table, notBlank)
  ]);
};

/**
 * Same as {@link createTable}, but the table can hold only one row.
 *
 * Adds a `singleton` primary key that defaults to `true`, and a `<name>_singleton`
 * check that it equals 1. The first insert gets `singleton = 1`; any further insert fails.
 * Update the row instead of inserting a new one.
 *
 * @param name - The table name in the database.
 * @param columns - The table's columns. Don't add `singleton`; it is added for you.
 * @param extraConfig - Your own constraints and indexes, same as `sqliteTable`'s third argument.
 *
 * @example
 * export const aboutTable = createSingletonTable('about', {
 *   contentAr: textNotNull(),
 *   contentEn: textNotNull()
 * });
 *
 * SQL output:
 * ```sql
 * CREATE TABLE `about` (
 *   `singleton` integer PRIMARY KEY DEFAULT true NOT NULL,
 *   `content_ar` text NOT NULL,
 *   `content_en` text NOT NULL,
 *   CONSTRAINT "about_singleton" CHECK("about"."singleton" = 1),
 *   CONSTRAINT "content_ar_not_blank" CHECK(length(trim("about"."content_ar", ' ' || char(9, 10, 13))) > 0),
 *   CONSTRAINT "content_en_not_blank" CHECK(length(trim("about"."content_en", ' ' || char(9, 10, 13))) > 0)
 * );
 * ```
 */
export const createSingletonTable = <TName extends Table, TColumns extends Record<string, SQLiteColumnBuilderBase>>(
  name: TName,
  columns: TColumns,
  extraConfig?: (table: BuildColumns<TName, TColumns, 'sqlite'>) => SQLiteTableExtraConfigValue[]
) => {
  return createTable(name, {
    singleton: integer({ mode: 'boolean' }).primaryKey().default(true),
    ...columns
  }, (table) => [
    check(`${name}_singleton`, sql`${table.singleton} = 1`),
    ...(extraConfig?.(table) ?? [])
  ]);
};
