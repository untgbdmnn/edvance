import { prismaClient } from "@/lib/db";
import { GradeAdd } from "../models/gradeModel";

export class GradeServices {
    static async AddGrade(request: GradeAdd, data?: any) {
        await prismaClient.grade.create({
            data: {
                name: request.name,
                level: request.level,
                schoolId: data.schoolId
            }
        })
        return {
            success: true,
            message: 'Berhasil menambahkan kelas',
        }
    }

    static async getAllData(request: { filter_nama?: string, page?: number, paginate?: number }, data?: any) {
        const page = request.page || 1;
        const perPage = request.paginate || 2;
        const skip = (page - 1) * perPage;

        let whereClause: any = { schoolId: data?.schoolId };

        if (request.filter_nama && request.filter_nama.trim() !== '') {
            whereClause.name = {
                contains: request.filter_nama.trim(),
                mode: 'insensitive'
            };
        }

        const [grade, totalCount] = await Promise.all([
            prismaClient.grade.findMany({
                where: whereClause,
                orderBy: { name: 'asc' },
                skip,
                take: perPage
            }),
            prismaClient.grade.count({ where: whereClause })
        ]);

        return {
            success: true,
            data: {
                data: grade,
                total: totalCount,
                page,
                perPage,
                lastPage: Math.ceil(totalCount / perPage)
            },
            message: "Berhasil mengambil data kelas!"
        }
    }
}