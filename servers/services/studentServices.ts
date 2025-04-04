import { prismaClient } from "@/lib/db";
import { EditStudent, StudentNew } from "../models/studentModel";
import { convertSlug } from "@/resources/helpers/convertSlug";
import { hashPassword } from "@/resources/helpers/hasPassword";
import { JenisKelamin, Status } from "@prisma/client";

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
                orderBy: { siswa_nama: 'asc' },
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
        const updateData = await prismaClient.student.update({
            where: { studentId: request.studentId, schoolId: data?.schoolId },
            data: {
                siswa_nama: request.siswa_nama,
                siswa_nis: request.siswa_nis,
                siswa_nisn: request.siswa_nisn,
                siswa_email: request.siswa_email,
                siswa_telp: request.siswa_telp.toString(),
                jenis_kelamin: request.jenis_kelamin as JenisKelamin,
                siswa_alamat: request.siswa_alamat,
                siswa_status: request.siswa_status as Status
            }
        })

        if (updateData && request.siswa_nama) {
            await prismaClient.student.update({
                where: { studentId: request.studentId, schoolId: data?.schoolId },
                data: {
                    siswa_slug: convertSlug(request.siswa_nama)
                }
            })
        }

        return {
            success: true,
            message: "Berhasil mengubah data siswa!"
        }
    }
}