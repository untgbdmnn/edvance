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
    nama_siswa: string,
    nisn_siswa: string,
    nis_siswa: string,
    siswa_email: string,
    siswa_phone: number,
    jenis_kelamin: null | undefined,
    alamat: string,
}