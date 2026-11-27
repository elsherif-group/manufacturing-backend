import { createSingletonTable, textNotNull } from '@/lib/drizzle.lib';
import { text } from 'drizzle-orm/sqlite-core';

export const companyInfoTable = createSingletonTable('company_info', {
  email: text(),
  phone: textNotNull(),
  whatsappNumber: textNotNull(),
  locationAr: textNotNull(),
  locationEn: textNotNull(),
  workingHoursAr: textNotNull(),
  workingHoursEn: textNotNull(),
  instagramUrl: textNotNull(),
  linkedinUrl: textNotNull(),
  facebookUrl: textNotNull(),
  locationUrl: textNotNull(),
  youtubeUrl: textNotNull()
});
