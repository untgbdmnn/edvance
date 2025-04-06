export interface RequestAddTeacher {
    teacher_name: string
    email: string
    phone: number
    address: string
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