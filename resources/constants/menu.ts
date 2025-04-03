import { PiStudentDuotone } from "react-icons/pi";
import { MdOutlineDataset, MdOutlineDashboard, MdOutlineSettingsInputComponent } from "react-icons/md";


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
                url: "/learning-time",
            },
            {
                title: "Kelas",
                url: "/class",
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