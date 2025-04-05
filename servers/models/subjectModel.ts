export interface AddSubject {
    nama_subject: string;
    kode_subject: string;
    teacher_id?: number;
}
export interface UpdateSubject {
    id: number;
    nama_subject: string;
    kode_subject: string;
    teacher_id?: number;
}