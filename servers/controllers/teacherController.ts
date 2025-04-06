import parseRequest from "@/resources/helpers/parseRequest";
import { Hono } from "hono";
import { User } from "@prisma/client";
import { RequestAddTeacher } from "../models/teacherModel";
import { teacherServices } from "../services/teacherServices";

export const teacherController = new Hono<{ Variables: { user: User } }>();

teacherController.post('/add', async (c) => {
    const user = c.get('user');
    const request = await parseRequest<RequestAddTeacher>(c)
    const response = await teacherServices.AddTeacher(request, user)
    return c.json(response)
})

teacherController.post('/list', async (c) => {
    const user = c.get('user');
    const request = await parseRequest<{ filter_nama?: string, page?: number, paginate?: number }>(c)
    const response = await teacherServices.GetAllData(request, user)
    return c.json(response)
})