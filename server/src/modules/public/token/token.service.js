// Importing modules 
import BadRequest from "../../../shared/errors/badrequest.error.js";
import NotFound from "../../../shared/errors/notfound.error.js";
import sendMail from "../../../shared/utils/sendMail.util.js";
import { generateOtp, generateResetToken } from "../../../shared/utils/token.util.js";
import TokenRepository from "../../../shared/repositories/token.repository.js";
import envs from "../../../shared/config/env.config.js";
import EXPIRY_CONSTANTS from "../../../shared/constants/expiry.constants.js";

// class to handle the token services
class TokenService {
    constructor() {

        // initializing the token repository
        this.tokenRepository = new TokenRepository();

    }

    // method to cerate and send a otp
    async createAndSendOTP(userId, email) {

        // generating the otp
        const otp = generateOtp();

        // creating the token
        const token = await this.tokenRepository.createToken({
            userId,
            token: otp,
            type: "otp",
            expiresAt: new Date(Date.now() + EXPIRY_CONSTANTS.otpToken) // expires in 10 minutes
        });

        sendMail(email, "Your OTP for GLPDDP", `Your OTP for GLPDDP is ${otp}. It will expire in 10 minutes.`);

        return token;
    }

    async verifyOtp(userId, otp) {

        // finding the token
        const token = await this.tokenRepository.findOneToken({ userId, type: "otp" });

        // if token not found
        if (!token) {
            throw new NotFound("Invalid OTP");
        }

        // incrementing the tries
        await this.tokenRepository.updateOneToken({ _id: token._id }, { tries: token.tries + 1 });

        // checking if the token is expired
        if (token.tries >= 5) {

            // deleting the token
            await this.tokenRepository.deleteToken({ _id: token._id });

            // throwing the error
            throw new BadRequest("Too many attempts. Please request a new OTP.");

        }

        // verifying the token
        if (token.token !== otp) {

            // incrementing the tries
            throw new BadRequest("Invalid OTP");

        }



        return token;
    }

    async deleteOtp(userId) {

        // deleting the token
        const token = await this.tokenRepository.deleteToken({ userId, type: "otp" });

        // returning the token
        return token;

    }

    async createAndSendResetToken(userId, email) {

        // deleting the existing reset token
        await this.tokenRepository.deleteToken({ userId, type: "reset" });

        // generating the reset token
        const resetToken = generateResetToken();

        // creating the token
        const token = await this.tokenRepository.createToken({
            userId,
            token: resetToken,
            type: "reset",
            expiresAt: new Date(Date.now() + EXPIRY_CONSTANTS.resetToken)
        });

        sendMail(email, "Your Password Reset Token for GLPDDP", `Click to reset your password <a href="${envs.FRONTEND_URL}/reset-password/${resetToken}">Click here</a>`);

        return token;
    }

    async verifyResetToken(resetToken) {

        // finding the token
        const token = await this.tokenRepository.findOneToken({ token: resetToken, type: "reset" });
      
        // if token not found
        if (!token) {
            throw new NotFound("Invalid reset token");
        }
      
        // verifying the token
        if (token.token !== resetToken) {

            // throwing the error
            throw new BadRequest("Invalid reset token");
        }

        return token.userId;
    }

    async deleteResetToken(userId) {

        // deleting the token
        const token = await this.tokenRepository.deleteToken({ userId, type: "reset" });

        // returning the token
        return token;
    }
}

export default TokenService;