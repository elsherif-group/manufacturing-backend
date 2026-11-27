import { ACTIONS, TABLES } from '@/constants/db.constants';
import { Permission } from '@/types/db.types';

export const generatePermissionsEnum = () => {
  const permissions: Permission[] = [];
  for (const table of TABLES) {
    for (const action of ACTIONS) {
      permissions.push(`${table}:${action}`);
    }
  }
  return Object.freeze(permissions);
};
