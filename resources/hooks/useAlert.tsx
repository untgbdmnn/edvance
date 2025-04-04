"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { CircleAlert, CircleCheck, CircleX, Info } from "lucide-react";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

type AlertType = "error" | "info" | "success" | "warning" | null;

interface AlertOptions {
    title: string;
    message?: string;
    showButton?: boolean;
    autoClose?: boolean;
    duration?: number;
    onClose?: () => void;
    typealert?: AlertType;
    onConfirmed?: () => Promise<void> | void;
    confirmText?: string;
    closeText?: string;
}

interface AlertContextType {
    showAlert: (options: AlertOptions) => Promise<boolean>;
    closeAlert: () => void;
}

// Create context with proper typing and initial value
const AlertContext = createContext<AlertContextType>({
    showAlert: () => Promise.resolve(false),
    closeAlert: () => { }
});

export const AlertProvider = ({ children }: { children: ReactNode }) => {
    const [alertData, setAlertData] = useState<(AlertOptions & { resolve?: (value: boolean) => void }) | null>(null);

    const showAlert = (options: AlertOptions): Promise<boolean> => {
        return new Promise<boolean>((resolve) => {
            setAlertData({
                ...options,
                resolve,
                showButton: options.showButton ?? false,
                autoClose: options.autoClose ?? true,
                duration: options.duration ?? 1000,
                confirmText: options.confirmText ?? "Ya",
                closeText: options.closeText ?? "Close"
            });

            if (options.autoClose && !options.showButton) {
                setTimeout(() => {
                    closeAlert();
                }, options.duration ?? 1000);
            }
        });
    };

    const closeAlert = () => {
        if (alertData?.onClose) alertData.onClose();
        if (alertData?.resolve) alertData.resolve(false);
        setAlertData(null);
    };

    const handleConfirm = async () => {
        if (alertData?.onConfirmed) {
            await alertData.onConfirmed();
        }
        if (alertData?.resolve) alertData.resolve(true);
        setAlertData(null);
    };

    return (
        <AlertContext.Provider value={{ showAlert, closeAlert }}>
            {children}
            {alertData && (
                <AlertDialog open={true} onOpenChange={closeAlert}>
                    <AlertDialogContent className="">
                        <div>
                            <div className="flex gap-4 flex-col items-center justify-center">
                                {alertData.typealert === "error" && <CircleX className="size-14 text-danger flex-none mt-2" />}
                                {alertData.typealert === "info" && <Info className="size-14 text-info flex-none mt-2" />}
                                {alertData.typealert === "success" && <CircleCheck className="size-14 text-success flex-none mt-2" />}
                                {alertData.typealert === "warning" && <CircleAlert className="size-14 text-warning flex-none mt-2" />}
                                <div className="flex items-center justify-center flex-col">
                                    <AlertDialogTitle className="text-xl">{alertData.title}</AlertDialogTitle>
                                    {alertData.message && <p className="text-sm font-normal text-dark text-center">{alertData.message}</p>}
                                </div>
                            </div>
                        </div>
                        {alertData.showButton && (
                            <AlertDialogFooter className="flex items-center justify-center w-full">
                                <AlertDialogCancel asChild>
                                    <Button onClick={closeAlert} variant="outline" className="cursor-pointer"> 
                                        {alertData.closeText}
                                    </Button>
                                </AlertDialogCancel>
                                <Button onClick={handleConfirm} className="cursor-pointer">{alertData.confirmText}</Button>
                            </AlertDialogFooter>
                        )}
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </AlertContext.Provider>
    );
};

export const useAlert = () => {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error("useAlert must be used within an AlertProvider");
    }
    return context;
};