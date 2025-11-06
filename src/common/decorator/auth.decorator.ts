
import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/Auth';
import { RolesGuard } from '../guards/authorization';
import { UserRole } from '../types/types';

export function Auth(...roles: UserRole[]) {
    return applyDecorators(
        SetMetadata('roles', roles),
        UseGuards(AuthGuard, RolesGuard),
    );
}
