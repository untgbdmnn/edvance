import { prismaClient } from "@/lib/db";
import { AddSubject, UpdateSubject } from "../models/subjectModel";
import { User } from "@prisma/client";

export class SubjectServices {
    static async AddSubject(request: AddSubject, data?: User) {

        const subject = await prismaClient.subject.create({
            data: {
                subjectName: request.nama_subject,
                subjectCode: request.kode_subject,
                teacherId: request.teacher_id ? Number(request.teacher_id) : null,
                schoolId: data?.schoolId
            }
        });

        if (subject) {
            await prismaClient.historySubject.create({
                data: {
                    subjectId: subject.subjectId,
                    subjectName: subject.subjectName,
                    subjectCode: subject.subjectCode,
                    teacherId: subject.teacherId,
                    schoolId: subject.schoolId,
                    userId: data?.userId,
                    historyBy: data?.name,
                    historyStatus: "CREATED"
                }
            })
        } else {
            return {
                success: false,
                message: "Failed to added data subject!"
            }
        }

        return {
            success: true,
            message: 'Subject added successfully',
            data: subject
        };
    }

    static async getAllData(request: { filter_nama?: string, page?: number, paginate?: number }, data?: any) {
        const page = request.page || 1;
        const perPage = request.paginate || 2;
        const skip = (page - 1) * perPage;

        let whereClause: any = { schoolId: data?.schoolId };

        if (request.filter_nama && request.filter_nama.trim() !== '') {
            whereClause.subjectName = {
                contains: request.filter_nama.trim(),
                mode: 'insensitive'
            };
        }

        const [subject, totalCount] = await Promise.all([
            prismaClient.subject.findMany({
                where: whereClause,
                orderBy: { subjectName: 'asc' },
                skip,
                take: perPage
            }),
            prismaClient.subject.count({ where: whereClause })
        ]);

        return {
            success: true,
            data: {
                data: subject,
                total: totalCount,
                page,
                perPage,
                lastPage: Math.ceil(totalCount / perPage)
            },
            message: "Berhasil mengambil data Mata pelajaran!"
        }
    }

    static async updateData(request: UpdateSubject, data?: any) {
        const subject = await prismaClient.subject.update({
            where: { subjectId: request.id },
            data: {
                subjectName: request.nama_subject,
                subjectCode: request.kode_subject,
                teacherId: request.teacher_id ? Number(request.teacher_id) : null,
            }
        });

        if (subject) {
            const latestHistory = await prismaClient.historySubject.findFirst({
                where: { subjectId: request.id },
                orderBy: { createdAt: "desc" }
            })
            if (latestHistory) {
                await prismaClient.historySubject.create({
                    data: {
                        historyOldId: latestHistory.historyId,
                        subjectId: subject.subjectId,
                        subjectName: subject.subjectName,
                        subjectCode: subject.subjectCode,
                        teacherId: subject.teacherId,
                        schoolId: subject.schoolId,
                        userId: data?.userId,
                        historyBy: data?.name,
                        historyStatus: "UPDATED"
                    }
                })
            }
        } else {
            return {
                success: false,
                message: "Failed to update data subject!"
            }
        }

        return {
            success: true,
            message: 'Subject updated successfully'
        };
    }

    static async getHistory(request: { id: number, page?: number, paginate?: number }, data?: any) {
        const page = request.page || 1;
        const perPage = request.paginate || 2;
        const skip = (page - 1) * perPage;

        const [dataHistory, totalCount] = await Promise.all([
            prismaClient.historySubject.findMany({
                where: { subjectId: request.id },
                include: {
                    history: true,
                    user: {
                        select: { role: true, name: true }
                    }
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: perPage
            }),
            prismaClient.historySubject.count({ where: { subjectId: request.id } })
        ]);

        const latestHistory = await prismaClient.historySubject.findFirst({
            where: { subjectId: request.id, schoolId: data.schoolId },
            orderBy: { createdAt: 'desc' },
            select: {
                historyId: true
            }
        })

        return {
            success: true,
            message: "Berhasil mendapatkan data history!",
            data: {
                latest: latestHistory,
                data: dataHistory,
                total: totalCount,
                page,
                perPage,
                lastPage: Math.ceil(totalCount / perPage)
            },
        }
    }

    static async revertHistory(request: { historyId: number, subjectId: number }, data?: any) {
        const history = await prismaClient.historySubject.findFirst({
            where: { schoolId: data?.schoolId, historyId: request.historyId, subjectId: request.subjectId }
        })
        const latest = await prismaClient.historySubject.findFirst({
            where: { schoolId: data?.schoolId, subjectId: request.subjectId },
            orderBy: { createdAt: 'desc' }
        })
        const subjectData = await prismaClient.subject.findFirst({
            where: { schoolId: data?.schoolId, subjectId: request.subjectId }
        })

        if (history?.historyId === latest?.historyId) {
            return {
                success: false,
                message: "Tidak dapat mengembalikan history karena history ini adalah history terbaru!"
            }
        }

        if (history?.subjectName === subjectData?.subjectName || history?.subjectCode === subjectData?.subjectCode) {
            return {
                success: false,
                message: "Tidak dapat mengembalikan data, karena terdapat kesamaan data!"
            }
        }

        const reverted = await prismaClient.subject.update({
            where: { schoolId: data?.schoolId, subjectId: request.subjectId },
            data: { subjectName: history?.subjectName!, subjectCode: history?.subjectCode, teacherId: history?.teacherId }
        })
        if (reverted) {
            await prismaClient.historySubject.create({
                data: {
                    historyOldId: latest?.historyId,
                    subjectId: history?.subjectId,
                    subjectName: history?.subjectName,
                    subjectCode: history?.subjectCode,
                    teacherId: history?.teacherId,
                    schoolId: history?.schoolId,
                    userId: data?.userId,
                    historyBy: data?.name,
                    historyStatus: "REVERTED"
                }
            })

            return {
                success: true,
                message: "Data berhasil dikembalikan!"
            }
        }
    }
}