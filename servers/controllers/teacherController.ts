import parseRequest from "@/resources/helpers/parseRequest";
import { Hono } from "hono";
import { User } from "@prisma/client";
import { RequestAddTeacher, RequestEditTeacher, toTeacherResponse } from "../models/teacherModel";
import { teacherServices } from "../services/teacherServices";
import { prismaClient } from "@/lib/db";

export const teacherController = new Hono<{ Variables: { user: User } }>();

teacherController.post('/add', async (c) => {
    const user = c.get('user');
    const request = await parseRequest<RequestAddTeacher>(c)
    const response = await teacherServices.AddTeacher(request, user)
    return c.json(response)
})

teacherController.patch('/edit', async (c) => {
    const user = c.get('user');
    const request = await parseRequest<RequestEditTeacher>(c)
    const response = await teacherServices.EditTeacher(request, user)
    return c.json(response)
})

teacherController.post('/list', async (c) => {
    const user = c.get('user');
    const request = await parseRequest<{ filter_nama?: string, page?: number, paginate?: number }>(c)
    const response = await teacherServices.GetAllData(request, user)
    return c.json(response)
})

teacherController.post('/get-trash', async (c) => {
    const user = c.get('user');
    const request = await parseRequest<{ page?: number, paginate?: number }>(c)
    const response = await teacherServices.getTrash(request, user)
    return c.json(response)
})

teacherController.post('/detail', async (c) => {
    const user = c.get('user');
    const request = await parseRequest<{ teacherId: number }>(c)
    const data = await prismaClient.teacher.findFirst({
        where: { schoolId: user.schoolId, teacherId: request.teacherId }
    })
    const response = toTeacherResponse(true, "Berhasil mengambil data detail!", data)
    return c.json(response)
})

teacherController.post('/deleted', async (c) => {
    const user = c.get('user');
    const request = await parseRequest<{ teacherId: number }>(c)
    const response = await teacherServices.DeletedData(request, user)
    return c.json(response)
})

teacherController.post('/pulihkan', async (c) => {
    const user = c.get('user');
    const request = await parseRequest<{ teacherId: number[] }>(c)
    const response = await teacherServices.PulihkanData(request, user)
    return c.json(response)
})

teacherController.post('/delete-permanent', async (c) => {
    const user = c.get('user');
    const request = await parseRequest<{ teacherId: number[] }>(c)
    const response = await teacherServices.DeletePermanent(request, user)
    return c.json(response)
})