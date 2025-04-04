import parseRequest from "@/resources/helpers/parseRequest";
import { Hono } from "hono";
import { User } from "@prisma/client";
import { GradeServices } from "../services/gradeServices";
import { GradeAdd } from "../models/gradeModel";
import { prismaClient } from "@/lib/db";

export const gradeController = new Hono<{ Variables: { user: User } }>();

gradeController.post('/add', async (c) => {
    const user = c.get('user');
    const request = await parseRequest<GradeAdd>(c)
    const response = await GradeServices.AddGrade(request, user)
    return c.json(response)
})

gradeController.post('/list', async (c) => {
    const user = c.get('user');
    const request = await parseRequest<{ filter_nama?: string, page?: number, paginate?: number }>(c)
    const response = await GradeServices.getAllData(request, user)
    return c.json(response)
})

gradeController.post('/detail', async (c) => {
    const request = await parseRequest<{ classId: number }>(c)
    const data = await prismaClient.grade.findFirst({
        where: { gradeId: request.classId }
    })
    if (data) {
        return c.json({
            success: true,
            message: "Berhasil mendapatkan data!",
            data: data,
        })
    } else {
        return c.json({
            success: false,
            message: "Data tidak ditemukan!",
        })
    }
})