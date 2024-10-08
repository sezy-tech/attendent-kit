import { SetMetadata } from '@nestjs/common';
import { roleMap } from 'src/helpers/role.helper';

type UserRole = keyof typeof roleMap

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles.map(role => roleMap[role]));
