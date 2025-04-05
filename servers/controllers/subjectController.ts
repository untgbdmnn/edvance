import parseRequest from "@/resources/helpers/parseRequest";
import { Hono } from "hono";
import { User } from "@prisma/client";
import { AddSubject, UpdateSubject } from "../models/subjectModel";
import { SubjectServices } from "../services/subjectServices";
import { prismaClient } from "@/lib/db";

export const subjectController = new Hono<{ Variables: { user: User } }>();

subjectController.post('/add-subject', async (c) => {
    const user = c.get('user');
    const request = await parseRequest<AddSubject>(c)
    const response = await SubjectServices.AddSubject(request, user)
    return c.json(response)
})

subjectController.post('/edit-subject', async (c) => {
    const user = c.get('user');
    const request = await parseRequest<UpdateSubject>(c)
    const response = await SubjectServices.updateData(request, user)
    return c.json(response)
})

subjectController.post('/list', async (c) => {
    const user = c.get('user');
    const request = await parseRequest<{ filter_nama?: string, page?: number, paginate?: number }>(c)
    const response = await SubjectServices.getAllData(request, user)
    return c.json(response)
})

subjectController.post('/get-detail', async (c) => {
    const user = c.get('user');
    const request = await parseRequest<{ subjectId: number }>(c)
    const detail = await prismaClient.subject.findFirst({
        where: { schoolId: user.schoolId, subjectId: request.subjectId }
    })
    if (!detail) {
        return c.json({
            success: false,
            message: "Data tidak ditemukan!"
        })
    } else {
        return c.json({
            success: true,
            message: "Berhasil mendapatkan data!",
            data: detail
        })
    }
})

subjectController.post('/get-history', async (c) => {
    const user = c.get('user');
    const request = await parseRequest<{ id: number, page?: number, paginate?: number }>(c)
    const response = await SubjectServices.getHistory(request, user)
    return c.json(response)
})