import parseRequest from "@/resources/helpers/parseRequest";
import { Hono } from "hono";
import { CreateNew } from "../models/sekolahModel";
import { SchoolServices } from "../services/schoolServices";
import { User } from "@prisma/client";
import { prismaClient } from "@/lib/db";

export const schoolController = new Hono<{ Variables: { user: User } }>();

schoolController.get('/check-status', async (c) => {
    const user = c.get("user")

    if (user?.schoolId) {
        const checkSekolah = user.schoolId !== null ? await prismaClient.sekolah.findFirst({
            where: { schoolid: user.schoolId }
        }) : null;
        if (!checkSekolah) {
            return c.json({ isNew: false })
        } else {
            return c.json<{ isNew: boolean }>({ isNew: true })
        }
    } else {
        return c.json<{ isNew: boolean }>({ isNew: true })
    }
})

schoolController.post('/create-new', async (c) => {
    const user = c.get('user');
    const request = await parseRequest<CreateNew>(c)
    const response = await SchoolServices.CreateNew(request, user)
    return c.json(response)
})