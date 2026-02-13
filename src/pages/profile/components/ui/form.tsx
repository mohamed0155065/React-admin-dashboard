// src/components/ui/form.tsx
import React from "react";
import {
    Control,
    Controller,
    FieldValues,
    FormProvider,
    UseFormReturn,
    useFormContext,
} from "react-hook-form";

// Form wrapper يستخدم FormProvider
interface FormProps {
    children: React.ReactNode;
    form: UseFormReturn<any>;
}

export const Form: React.FC<FormProps> = ({ children, form }) => {
    return <FormProvider {...form}>{children}</FormProvider>;
};

// FormField يستخدم Controller من react-hook-form
interface FormFieldProps {
    control: Control<any>;
    name: string;
    render: ({ field }: any) => React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({ control, name, render }) => {
    return <Controller control={control} name={name} render={render} />;
};

// مكونات UI بسيطة
export const FormItem: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <div className="flex flex-col">{children}</div>;
};

export const FormLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <label className="font-medium mb-1">{children}</label>;
};

export const FormControl: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <div>{children}</div>;
};

// FormMessage يظهر خطأ الحقل
export const FormMessage: React.FC<{ name?: string }> = ({ name }) => {
    const { formState } = useFormContext();
    const error = name ? formState.errors[name] : undefined;
    if (!error) return null;

    return <p className="text-red-500 text-sm">{(error as any)?.message}</p>;
};
