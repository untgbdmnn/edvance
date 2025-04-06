import { hashPassword } from "@/resources/helpers/hasPassword";
import { RequestAddTeacher, toTeacherResponse } from "../models/teacherModel";
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
}