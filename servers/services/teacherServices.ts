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
}