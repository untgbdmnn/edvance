import { PiStudentDuotone } from "react-icons/pi";
import { MdOutlineDataset, MdOutlineDashboard, MdOutlineSettingsInputComponent } from "react-icons/md";
import { FaChalkboardTeacher } from "react-icons/fa";

export const MenuMain = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: MdOutlineDashboard,
    },
    {
        title: "Master Data",
        icon: MdOutlineDataset,
        items: [
            {
                title: "Jam Belajar",
                url: "/learning-hours",
            },
            {
                title: "Kelas",
                url: "/grade-list",
            },
            {
                title: "Mata Pelajaran",
                url: "/subject",
            },
            {
                title: "Jurusan",
                url: "/major",
            },
        ],
    },
    {
        title: "Siswa",
        icon: PiStudentDuotone,
        items: [
            {
                title: "Daftar Siswa",
                url: "/students-list",
            },
        ],
    },
    {
        title: "Guru",
        url: "/teachers",
        icon: FaChalkboardTeacher,
    },
    {
        title: "Settings",
        icon: MdOutlineSettingsInputComponent,
        items: [
            {
                title: "Profile",
                url: "/profile",
            },
        ],
    },
]