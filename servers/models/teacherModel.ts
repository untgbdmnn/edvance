export interface RequestAddTeacher {
    teacher_name: string
    email: string
    phone: number
    address: string
}
export interface RequestEditTeacher {
    teacher_name: string
    email: string
    phone: number
    address: string
    teacherId: number
}


type BasicResponse = {
    success: boolean;
    message: string;
    data?: any;
};

export const toTeacherResponse = (success: boolean, message: string, data?: any): BasicResponse => ({
    success,
    message,
    data: data || {}
});