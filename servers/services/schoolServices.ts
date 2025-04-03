import { prismaClient } from "@/lib/db";
import { CreateNew } from "../models/sekolahModel";
import { SchoolStatus, SchoolType } from "@prisma/client";

export class SchoolServices {
    static async CreateNew(request: CreateNew, data?: any) {
        if (request.nama_sekolah == '' || request.email == '' || request.npsn === 0) {
            return {
                success: false,
                message: "Nama Sekolah dan Email, serta NPSN tidak boleh kosong"
            }
        }
        const newSchool = await prismaClient.sekolah.create({
            data: {
                nama_sekolah: request.nama_sekolah!,
                email: request.email,
                website: request.website,
                npsn: request.npsn.toString(),
                address: request.alamat_sekolah,
                type: request.type_sekolah as SchoolType,
                schoolStatus: request.status_sekolah as SchoolStatus,
                status: "ACTIVE"
            }
        })

        const updatedUser = await prismaClient.user.update({
            where: { userId: data?.userId },
            data: {
                schoolId: newSchool.schoolid
            },
            include: {
                school: true
            }
        })

        if (newSchool && updatedUser) {
            return {
                success: true,
                message: "Berhasil memperbarui data!",
                data: updatedUser
            }
        } else {
            return {
                success: false,
                message: "Gagal memperbarui data sekolah!"
            }
        }
    }
}