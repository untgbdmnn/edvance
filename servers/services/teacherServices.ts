import { hashPassword } from "@/resources/helpers/hasPassword";
import { RequestAddTeacher, RequestEditTeacher, toTeacherResponse } from "../models/teacherModel";
import { prismaClient } from "@/lib/db";

export class teacherServices {
    static async AddTeacher(request: RequestAddTeacher, data?: any) {
        if (request.teacher_name == '' || request.email == '') {
            return toTeacherResponse(false, 'Please fill in all fields');
        }

        const emailExist = await prismaClient.teacher.count({
            where: { email: request.email }
        })

        if (emailExist > 0) {
            return toTeacherResponse(false, "Email sudah terpakai, gunakan email yang lain!")
        }

        const passwordGuru = await hashPassword(request.teacher_name)
        const add = await prismaClient.teacher.create({
            data: {
                schoolId: data.schoolId,
                name: request.teacher_name,
                email: request.email,
                address: request.address,
                phone: request.phone.toString(),
                password: passwordGuru,
                status: "ACTIVE"
            }
        })
        if (add) {
            const addHistory = await prismaClient.historyTeacher.create({
                data: {
                    name: request.teacher_name,
                    email: request.email,
                    password: passwordGuru,
                    phone: request.phone.toString(),
                    address: request.address,
                    schoolId: data.schoolId,
                    teacherId: add.teacherId,
                    historyStatus: "CREATED",
                    historyBy: data.name,
                    userId: data.userId
                }
            })
            if (addHistory) {
                return toTeacherResponse(true, "Berhasil menambahkan guru!")
            } else {
                return toTeacherResponse(false, "Gagal menambahkan guru!");
            }
        }
    }

    static async EditTeacher(request: RequestEditTeacher, data?: any) {
        if (request.teacher_name == '' || request.email == '') {
            return toTeacherResponse(false, 'Please fill in all fields');
        }

        const updated = await prismaClient.teacher.update({
            where: { schoolId: data.schoolId, teacherId: request.teacherId },
            data: {
                schoolId: data.schoolId,
                name: request.teacher_name,
                email: request.email,
                address: request.address,
                phone: request.phone.toString(),
                status: "ACTIVE"
            }
        })
        if (updated) {
            const latestHistory = await prismaClient.historyTeacher.findFirst({
                where: { schoolId: data.schoolId, teacherId: request.teacherId },
                orderBy: { createdAt: "desc" }
            })
            const addHistory = await prismaClient.historyTeacher.create({
                data: {
                    historyOldId: latestHistory?.historyId,
                    name: request.teacher_name,
                    email: request.email,
                    phone: request.phone.toString(),
                    address: request.address,
                    schoolId: data.schoolId,
                    teacherId: updated.teacherId,
                    historyStatus: "UPDATED",
                    historyBy: data.name,
                    userId: data.userId
                }
            })
            if (addHistory) {
                return toTeacherResponse(true, "Berhasil mengubah data guru!")
            } else {
                return toTeacherResponse(false, "Gagal mengubah data guru!");
            }
        }
    }

    static async GetAllData(request: { filter_nama?: string, page?: number, paginate?: number }, data?: any) {
        const page = request.page || 1;
        const perPage = request.paginate || 2;
        const skip = (page - 1) * perPage;

        let whereClause: any = { schoolId: data?.schoolId, status: "ACTIVE" };

        if (request.filter_nama && request.filter_nama.trim() !== '') {
            whereClause.name = {
                contains: request.filter_nama.trim(),
                mode: 'insensitive'
            };
        }

        const [teacher, totalCount] = await Promise.all([
            prismaClient.teacher.findMany({
                where: whereClause,
                orderBy: { name: 'asc' },
                skip,
                take: perPage
            }),
            prismaClient.teacher.count({ where: whereClause })
        ]);

        return toTeacherResponse(true, "Berhasil mendapatkan data guru!", {
            data: teacher,
            total: totalCount,
            page,
            perPage,
            lastPage: Math.ceil(totalCount / perPage)
        })
    }

    static async getTrash(request: { page?: number, paginate?: number }, data?: any) {
        const page = request.page || 1;
        const perPage = request.paginate || 2;
        const skip = (page - 1) * perPage;

        const [dataTrash, totalCount] = await Promise.all([
            prismaClient.teacher.findMany({
                where: { schoolId: data?.schoolId, status: "DELETED" },
                orderBy: { createdAt: 'desc' },
                skip,
                take: perPage
            }),
            prismaClient.teacher.count({ where: { status: "DELETED" } })
        ]);

        return toTeacherResponse(true, "Berhasil mendapatkan data history!", {
            data: dataTrash,
            total: totalCount,
            page,
            perPage,
            lastPage: Math.ceil(totalCount / perPage)
        })
    }

    static async DeletedData(request: { teacherId: number }, data?: any) {
        const dataDel = await prismaClient.teacher.update({
            where: { schoolId: data?.schoolId, teacherId: request.teacherId },
            data: { status: "DELETED" }
        })
        if (dataDel) {
            const latestHistory = await prismaClient.historyTeacher.findFirst({
                where: { schoolId: data.schoolId, teacherId: request.teacherId },
                orderBy: { createdAt: "desc" }
            })
            const addHistory = await prismaClient.historyTeacher.create({
                data: {
                    historyOldId: latestHistory?.historyId,
                    name: dataDel.name,
                    email: dataDel.email,
                    phone: dataDel.phone,
                    address: dataDel.address,
                    schoolId: data.schoolId,
                    teacherId: request.teacherId,
                    historyStatus: "DELETED",
                    historyBy: data.name,
                    userId: data.userId
                }
            })
            if (addHistory) {
                return toTeacherResponse(true, "Berhasil menghapus data guru!")
            } else {
                return toTeacherResponse(false, "Gagal menghapus data guru!")
            }
        }
    }

    static async PulihkanData(request: { teacherId: number[] }, data?: any) {
        const updateResult = await prismaClient.teacher.updateMany({
            where: {
                teacherId: { in: request.teacherId },
                schoolId: data.schoolId // Tambahkan schoolId untuk keamanan
            },
            data: { status: "ACTIVE" }
        });

        if (updateResult.count === 0) {
            return toTeacherResponse(false, "Tidak ada data yang dipulihkan");
        }

        const updatedTeachers = await prismaClient.teacher.findMany({
            where: {
                teacherId: { in: request.teacherId },
                schoolId: data.schoolId
            }
        });

        const historyResults = await Promise.all(
            updatedTeachers.map(async (teacher) => {
                const latestHistory = await prismaClient.historyTeacher.findFirst({
                    where: {
                        schoolId: data.schoolId,
                        teacherId: teacher.teacherId
                    },
                    orderBy: { createdAt: "desc" }
                });

                return await prismaClient.historyTeacher.create({
                    data: {
                        historyOldId: latestHistory?.historyId,
                        name: teacher.name,
                        email: teacher.email,
                        phone: teacher.phone,
                        address: teacher.address,
                        schoolId: data.schoolId,
                        teacherId: teacher.teacherId,
                        historyStatus: "RESTORED",
                        historyBy: data.name,
                        userId: data.userId
                    }
                });
            })
        );

        if (historyResults.length > 0) {
            return toTeacherResponse(
                true,
                `Berhasil memulihkan ${updateResult.count} data guru`,
                { restoredCount: updateResult.count }
            );
        } else {
            return toTeacherResponse(false, "Gagal membuat history pemulihan");
        }
    }

    static async DeletePermanent(request: { teacherId: number[] }, data?: any) {
        const del = await prismaClient.teacher.deleteMany({
            where: { schoolId: data.schoolId, teacherId: { in: request.teacherId } }
        })
        if (del) {
            return toTeacherResponse(true, "Berhasil menghapus permanen dana!")
        } else {
            return toTeacherResponse(false, "Gagal menghapus permanen dana!")
        }
    }

    static async GetHistory(request: { teacherId: number, page?: number, paginate?: number }, data?: any) {
        const page = request.page || 1;
        const perPage = request.paginate || 2;
        const skip = (page - 1) * perPage;

        const [dataHistory, totalCount] = await Promise.all([
            prismaClient.historyTeacher.findMany({
                where: { teacherId: request.teacherId },
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
            prismaClient.historyTeacher.count({ where: { teacherId: request.teacherId } })
        ]);

        const latestHistory = await prismaClient.historyTeacher.findFirst({
            where: { teacherId: request.teacherId, schoolId: data.schoolId },
            orderBy: { createdAt: 'desc' },
            select: {
                historyId: true
            }
        })

        return toTeacherResponse(true, "Berhasil mendapatkan data history!", {
            latest: latestHistory,
                data: dataHistory,
                total: totalCount,
                page,
                perPage,
                lastPage: Math.ceil(totalCount / perPage)
        })
    }
}