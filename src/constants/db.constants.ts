import { generatePermissionsEnum } from '@/lib/permissions.lib';

export const TABLES = Object.freeze([
  'projects',
  'products',
  'product_images',
  'project_images',
  'project_products',
  'about',
  'company_info',
  'suppliers',
  'partners',
  'users',
  'faqs',
  'quotations',
  'quotation_recipients'
] as const);

export const ACTIONS = Object.freeze([
  'create',
  'read',
  'update',
  'delete'
] as const);

export const PERMISSIONS = generatePermissionsEnum();