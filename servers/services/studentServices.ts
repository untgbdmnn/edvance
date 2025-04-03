import { prismaClient } from "@/lib/db";
import { EditStudent, StudentNew } from "../models/studentModel";
import { convertSlug } from "@/resources/helpers/convertSlug";
import { hashPassword } from "@/resources/helpers/hasPassword";

interface getAllDataReq {
    filter_nama?: string, page?: number, paginate?: number
}

export class StudentServices {
    static async createNew(request: StudentNew, data?: any) {
        if (request.nama_siswa == '' || request.nis_siswa == '' || request.nisn_siswa == '') {
            return {
                success: false,
                message: "Pastikan semua input sudah diisi!"
            }
        }
        if (request.siswa_email !== '') {
            const checkEmail = await prismaClient.student.count({
                where: { siswa_email: request.siswa_email }
            })
            if (checkEmail > 0) {
                return {
                    success: false,
                    message: "Email sudah digunakan!"
                }
            }
        }
        const siswaSlug = convertSlug(request.nama_siswa)
        const passwordSiswa = await hashPassword(request.nama_siswa);

        const newStudent = await prismaClient.student.create({
            data: {
                siswa_nama: request.nama_siswa,
                siswa_nis: request.nis_siswa,
                siswa_nisn: request.nisn_siswa,
                siswa_password: passwordSiswa,
                siswa_slug: siswaSlug!,
                jenis_kelamin: request.jenis_kelamin,
                siswa_email: request.siswa_email,
                siswa_telp: request.siswa_phone.toString(),
                siswa_alamat: request.alamat,
                siswa_status: "NEW",
                schoolId: data?.schoolId
            }
        })

        return {
            success: true,
            message: "Berhasil menambahkan siswa!"
        }
    }

    static async getAllData(request: getAllDataReq, data?: any) {
        const page = request.page || 1;
        const perPage = request.paginate || 2;
        const skip = (page - 1) * perPage;

        let whereClause: any = { schoolId: data?.schoolId };

        if (request.filter_nama && request.filter_nama.trim() !== '') {
            whereClause.siswa_nama = {
                contains: request.filter_nama.trim(),
                mode: 'insensitive'
            };
        }

        const [siswa, totalCount] = await Promise.all([
            prismaClient.student.findMany({
                where: whereClause,
                orderBy: { createdAt: 'desc' },
                skip,
                take: perPage
            }),
            prismaClient.student.count({ where: whereClause })
        ]);

        return {
            success: true,
            data: {
                data: siswa,
                total: totalCount,
                page,
                perPage,
                lastPage: Math.ceil(totalCount / perPage)
            },
            message: "Berhasil mengambil data penduduk!"
        }
    }

    static async editData(request: EditStudent, data?: any) {
        return {
            success: true,
            message: "Berhasil mengubah data siswa!"
        }
    }
}