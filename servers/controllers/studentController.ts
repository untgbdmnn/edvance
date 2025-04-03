import parseRequest from "@/resources/helpers/parseRequest";
import { Hono } from "hono";
import { User } from "@prisma/client";
import { StudentServices } from "../services/studentServices";
import { EditStudent, StudentNew } from "../models/studentModel";
import { prismaClient } from "@/lib/db";

export const studentController = new Hono<{ Variables: { user: User } }>();

studentController.post('/add-new', async (c) => {
    const user = c.get('user');
    const request = await parseRequest<StudentNew>(c)
    const response = await StudentServices.createNew(request, user)
    return c.json(response)
})

studentController.post('/list', async (c) => {
    const user = c.get('user');
    const request = await parseRequest<{ filter_nama?: string, page?: number, paginate?: number }>(c)
    const response = await StudentServices.getAllData(request, user)
    return c.json(response)
})

studentController.patch('/change-status', async (c) => {
    const request = await parseRequest<{ studentId: number }>(c)

    await prismaClient.student.update({
        where: {studentId: request.studentId},
        data: {siswa_status: "ACTIVE"}
    })
    return c.json({
        success: true,
        message: "Berhasil mengubah status siswa!"
    })
})

studentController.patch('/edit-data', async (c) => {
    const user = c.get('user');
    const request = await parseRequest<EditStudent>(c)
    const response = await StudentServices.editData(request, user)
    return c.json(response)
})