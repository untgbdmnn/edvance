import parseRequest from "@/resources/helpers/parseRequest";
import { Hono } from "hono";
import { CreateNew } from "../models/sekolahModel";
import { SchoolServices } from "../services/schoolServices";
import { User } from "@prisma/client";

export const schoolController = new Hono<{ Variables: { user: User } }>();

schoolController.post('/create-new', async (c) => {
    const user = c.get('user');
    const request = await parseRequest<CreateNew>(c)
    const response = await SchoolServices.CreateNew(request, user)
    return c.json(response)
})