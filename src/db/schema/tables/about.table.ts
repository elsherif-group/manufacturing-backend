import { createSingletonTable, textNotNull } from '@/lib/drizzle.lib';

export const aboutTable = createSingletonTable('about', {
  contentAr: textNotNull(),
  contentEn: textNotNull()
});
