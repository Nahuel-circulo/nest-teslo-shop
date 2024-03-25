import { Controller, Get, Post, Body } from '@nestjs/common';
import {  UseGuards } from '@nestjs/common/decorators';
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
import { Auth } from './decorators';
import { ApiResponse, ApiTags } from '@nestjs/swagger';


@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  @ApiResponse({status:201, description: 'User was created', type:User})
  @ApiResponse({status:400, description: 'Bad request'})
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }



  
  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('check-status')
  @Auth(ValidRoles.user)
  checkAuthStatus(@GetUser() user:User){
    return this.authService.checkAuthStatus(user);
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


  @Get('private3')
  @Auth(ValidRoles.admin,ValidRoles.userUser)
  privateRoute3(
    @GetUser() user: User) {

    return {
      ok: true,
      user
    }
  }

}