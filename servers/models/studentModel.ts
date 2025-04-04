export interface StudentNew {
    nama_siswa: string,
    nisn_siswa: string,
    nis_siswa: string,
    siswa_email: string,
    siswa_phone: number,
    jenis_kelamin: null | undefined,
    alamat: string,
}

export interface EditStudent {
    studentId: number,
    siswa_nama: string,
    siswa_nisn: string,
    siswa_nis: string,
    siswa_email: string,
    siswa_telp: number,
    jenis_kelamin: string,
    siswa_alamat: string,
    siswa_status: string
}