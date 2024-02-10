import { Controller, Get, Post, Body } from '@nestjs/common';
import { SetMetadata, UseGuards } from '@nestjs/common/decorators';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { RawHeaders } from './decorators/ger-rowHeaders.decorator';
import { UserRoleGuard } from './guards/user-role.guard';
import { RoleProtected } from './decorators/role-protected/role-protected.decorator';
import { ValidRoles } from './interfaces';



@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }



  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }


  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRpute(
    //Pasa por el Guards, si no esta el guard no se puede acceder a usuario
    // @Req() request: Express.Request,


    @GetUser() user: User,
    @GetUser('email') userEmail: string,
    @RawHeaders() rawHeaders: string[],
  ) {
    //console.log({user});
    //console.log({user:request.user});


    return {
      ok: true,
      user,
      userEmail,
      rawHeaders
    }
  }


  // @SetMetadata('roles', ['admin', 'super-user'])
  @Get('private2')
  @RoleProtected(ValidRoles.userUser,ValidRoles.admin)
  @UseGuards(AuthGuard(),UserRoleGuard)
  privateRoute2(
    @GetUser() user: User) {

    return {
      ok: true,
      user
    }
  }

}