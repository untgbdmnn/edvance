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
    const response = await SubjectServices.getAllData(request, { schoolId: user.schoolId ?? undefined })
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

subjectController.post('/revert-history', async (c) => {
    const user = c.get('user');
    const request = await parseRequest<{ historyId: number, subjectId: number }>(c)
    const response = await SubjectServices.revertHistory(request, user)
    return c.json(response)
})

subjectController.delete('/delete/:subjectId', async (c) => {
    const user = c.get('user');
    const subjectId = c.req.param('subjectId')

    const deleteData = await prismaClient.subject.update({
        where: { schoolId: user.schoolId, subjectId: parseInt(subjectId) },
        data: { status: "DELETED" }
    })

    if (deleteData) {
        return c.json({
            success: true,
            message: "Berhasil menghapus data mata pelajaran!"
        })
    } else {
        return c.json({
            success: false,
            message: "Gagal menghapus data mata pelajaran!"
        })
    }
})

subjectController.patch('/pulihkan', async (c) => {
    const user = c.get('user');
    const request = await parseRequest<{ subjectId: number | [] }>(c)

    let reverted
    if (Array.isArray(request.subjectId)) {
        reverted = await prismaClient.subject.updateMany({
            where: { schoolId: user.schoolId, subjectId: { in: request.subjectId } },
            data: { status: "ACTIVE" }
        })
    } else {
        reverted = await prismaClient.subject.update({
            where: { schoolId: user.schoolId, subjectId: request.subjectId },
            data: { status: "ACTIVE" }
        })
    }

    if (reverted) {
        return c.json({
            success: true,
            message: "Berhasil memulihkan data mata pelajaran!"
        })
    } else {
        return c.json({
            success: false,
            message: "Gagal memulihkan data mata pelajaran!"
        })
    }
})

subjectController.post('/delete-permanent', async (c) => {
    const user = c.get('user');
    const request = await parseRequest<{ subjectId: number | [] }>(c)

    let deleted
    if (Array.isArray(request.subjectId)) {
        deleted = await prismaClient.subject.deleteMany({
            where: { schoolId: user.schoolId, subjectId: { in: request.subjectId } },
        })
    } else {
        deleted = await prismaClient.subject.delete({
            where: { schoolId: user.schoolId, subjectId: request.subjectId },
        })
    }

    if (deleted) {
        return c.json({
            success: true,
            message: "Berhasil menghapus data mata pelajaran secara permanen!"
        })
    } else {
        return c.json({
            success: false,
            message: "Gagal menghapus data mata pelajaran secara permanen!"
        })
    }
})

subjectController.post('/get-trash', async (c) => {
    const user = c.get('user');
    const request = await parseRequest<{ page?: number, paginate?: number }>(c)
    const response = await SubjectServices.getTrash(request, user)
    return c.json(response)
})