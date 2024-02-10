import { Reflector } from '@nestjs/core';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { BadRequestException, ForbiddenException } from '@nestjs/common/exceptions';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(
    // para obtener la metadata
    private readonly reflector: Reflector,
    //private readonly allowedRoles: Array<string>,
  ) { }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    // los roles se encuentran en el decorador de setMetadata
    const validRoles: string[] = this.reflector.get('roles', context.getHandler())

    if (!validRoles) return true;
    if (validRoles.length === 0) return true;


    const req = context.switchToHttp().getRequest()
    const user = req.user;

    if(!user) throw new BadRequestException('User not found');
    for (const role of user.roles) {
      if(validRoles.includes(role)){
        return true;
      }
    }


    throw new ForbiddenException(`User ${user.fullName} need a valid role: [${validRoles}]`);
  }
}
