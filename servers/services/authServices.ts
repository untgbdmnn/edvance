import { hashPassword, verifyPassword } from "@/resources/helpers/hasPassword";
import { nanoid } from 'nanoid'
import { ForgotPasswordRquest, SignInRquest, SignUpRequest } from "../models/authModel";
import { prismaClient } from "@/lib/db";
export class AuthServices {
    static async REGISTER(request: SignUpRequest) {
        if (request.username == '' || request.password == '' || request.email == '') {
            return { status: 400, message: 'Please fill all fields' }
        }
        const emailExist = await prismaClient.user.count({ where: { email: request.email } })
        if (emailExist) {
            return { status: 400, message: 'Email already exist' }
        }

        const password = await hashPassword(request.password);
        await prismaClient.user.create({
            data: {
                name: request.username,
                email: request.email,
                password: password
            }
        })

        let resp = {
            status: 200,
            message: 'User created successfully',
        }
        return resp;
    }

    static async LOGIN(request: SignInRquest) {
        if (request.password == '' || request.email == '') {
            return { status: 400, message: 'Please fill all fields' };
        }

        const findUser = await prismaClient.user.findFirst({ where: { email: request.email } });
        if (!findUser) {
            return { status: 400, message: 'User not found' };
        }

        const validPw = await verifyPassword(request.password, findUser.password);
        if (!validPw) {
            return { message: 'Invalid password', status: 400 };
        }

        const tokenUser = nanoid(30);
        const updatedUser = await prismaClient.user.update({
            where: { userId: findUser.userId },
            data: { token: tokenUser }
        });

        let data: object = {};
        if (findUser.schoolId) {
            const all = await prismaClient.user.findFirst({
                where: { userId: findUser.userId },
                include: { school: true }
            });
            data = all as any;
        } else {
            data = updatedUser;
        }

        const resp = {
            status: 200,
            token: tokenUser,
            message: `Welcome to Sidara, ${updatedUser.name}!`,
            data: data
        };
        return resp;
    }

    static async FORGOTPASSWORD(request: ForgotPasswordRquest) {
        if (request.email === '' || request.password === '') {
            return { status: 400, message: 'Please fill all fields' }
        }

        const checkEmail = await prismaClient.user.findFirst({ where: { email: request.email } })
        if (!checkEmail) {
            return { status: 400, message: 'User not found' }
        }

        const newPass = await hashPassword(request.password)
        const updatedUser = await prismaClient.user.update({
            where: { email: checkEmail.email },
            data: { password: newPass }
        })

        let response = {
            status: 200,
            message: 'Password updated successfully',
        }

        return response;
    }

    static async GETTOKEN(token: string) {
        const user = await prismaClient.user.findFirst({
            where: { token: token }
        })

        if (user?.schoolId || user?.schoolId != null) {
            const data = await prismaClient.user.findFirst({
                where: { schoolId: user.schoolId },
                include: {
                    school: true
                }
            })
            return data
        } else {
            const data = await prismaClient.user.findFirst({
                where: { token: token }
            })

            return data;
        }
    }
}