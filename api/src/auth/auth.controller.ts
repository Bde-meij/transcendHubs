import {
	Controller,
	Get,
	Post,
	Body,
	UseGuards,
	Req,
	Res,
	HttpStatus,
	Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response, Express, response } from 'express';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/user/entities/user.entity';
import { JwtGuard } from './guard/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CallbackAuthDto } from './dto/callback-auth.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService, private readonly configService: ConfigService, private readonly userService: UserService) {}

	// Checks whether the user is authorized using the jwtguard
	// Returns: {loggedIn: true} on success - 401 Unauthorized on failure
	@Get('isloggedin')
	@UseGuards(JwtGuard)
	async checkLoggedIn() {
		return {loggedIn: true};
	}

	@Get('login')
	@UseGuards(AuthGuard('fortytwo'))
	async login() {}

	@Get('callback')
	@UseGuards(AuthGuard('fortytwo'))
	async callback(@Req() req: Request, @Res() res: Response) {
		const user: CallbackAuthDto = {
			id: (req.user as any).id,
			// nickname: (req.user as any).nickname,
		}
		// const user: User = {
		// 	id: (req.user as any).id,
		// 	nickname: (req.user as any).nickname,
		// 	status: "online",
		// 	avatar: "",
		// 	friendIn: [],
		// 	friendOut: [],
		// };
		const tokens = await this.authService.getJwtTokens(user);
		res.cookie('access_token', tokens.access_token);
		res.cookie('refresh_token', tokens.refresh_token);
		if (!await this.userService.userExists(user.id)) {
			console.log("user not found");
			res.status(HttpStatus.FOUND).redirect(`http://${req.hostname}:4200/register`);
		}
		else
		{
			console.log("user found");
			//if ((await this.userService.findUserById(user.id)).isTwoFAEnabled) {
				//res.status(HttpStatus.FOUND).redirect(`http://${req.hostname}:4200/2fa`);
			//}
			//else {
				this.userService.updateStatus(user.id, 'online');
				res.status(HttpStatus.FOUND).redirect(`http://${req.hostname}:4200/dashboard`);
			//}
		}
	}

	@Post('logout')
	@UseGuards(JwtGuard)
	async logout(@Req() req, @Res() res) {
		await this.userService.updateStatus(req.user.id, 'offline');
		res.clearCookie('access_token');
		res.clearCookie('refresh_token');
		res.status(200).send({message: 'Logged out successfully'});
	}

	@Get('2fasetup')
	@UseGuards(JwtGuard)
	async setupTwoFA(@Req() req, @Res() res) {
		const user: User = await this.userService.findUserById(req.user.id);
		const secret = await this.authService.generateTwoFASecret(user.id);
		const otpauthUrl = speakeasy.otpauthURL({
			secret: secret.ascii,
			label: `Transcendence (${user.id})`,
			issuer: 'Transcendence',
		});
		const qrCodeUrl = await QRCode.toDataURL(otpauthUrl);

		res.json({qrCode: qrCodeUrl, secret: secret.base32});
	}

	@Post('2faverify')
	@UseGuards(JwtGuard)
	async verifyTwoFA(@Req() req, @Res() res, @Body() body) {
		const user: User = await this.userService.findUserById(req.user.id);
		const secret = user.twoFASecret;
		const isValid = await this.authService.verifyTwoFAToken(secret, body.userInput);
		if (isValid) {
			res.json({message: 'Google 2FA verified'});
			if (!user.isTwoFAEnabled)
				await this.userService.enableTwoFA(user.id);
			if (user.status == 'offline')
				await this.userService.updateStatus(user.id, 'online');
		}
		else
			res.json({message: 'Invalid authentication code'});
	}

	@Post('2fadisable')
	@UseGuards(JwtGuard)
	async disableTwoFA(@Req() req) {
		this.userService.disableTwoFA(req.user.id);
		this.userService.updateTwoFASecret(req.user.id, {base32: null});
	}

	@Get('is2faenabled')
	@UseGuards(JwtGuard)
	async isTwoFAEnabled(@Req() req, @Res() res) {
		const isEnabled = (await this.userService.findUserById(req.user.id)).isTwoFAEnabled;
		res.json({isTwoFAEnabled: isEnabled});
	}
}