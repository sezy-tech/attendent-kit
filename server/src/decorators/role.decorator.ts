import { SetMetadata } from '@nestjs/common';
import { roleMap } from 'src/helpers/role.helpers';

type UserRole = keyof typeof roleMap

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles.map(role => roleMap[role]));
