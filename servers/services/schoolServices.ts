import { CreateNew } from "../models/sekolahModel";

export class SchoolServices {
    static async CreateNew(request: CreateNew, data?: any) {
        if(request.nama_sekolah == '' || request.email == '') {
            return {
                success: false,
                message: "Nama Sekolah dan Email tidak boleh kosong"
            }
        }
        return {
            success: true,
            message: "Berhasil memperbarui data sekolah!"
        }
    }
}