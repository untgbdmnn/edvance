import parseRequest from "@/resources/helpers/parseRequest";
import { Hono } from "hono";
import { SignInRquest, SignUpRequest } from "../models/authModel";
import { AuthServices } from "../services/authServices";

export const authController = new Hono()

authController.post('/register', async (c) => {
    const request = await parseRequest<SignUpRequest>(c)
    const response = await AuthServices.REGISTER(request)
    return c.json(response)
})

authController.post('/login', async (c) => {
    const request = await parseRequest<SignInRquest>(c)
    const response = await AuthServices.LOGIN(request)
    return c.json(response)
})