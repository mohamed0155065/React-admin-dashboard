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

// --------------------------
// Form: wrapper around FormProvider
// --------------------------
// Usage: <Form form={formInstance}>...</Form>
interface FormProps {
    children: React.ReactNode;
    form: UseFormReturn<any>; // instance returned by useForm()
}

export const Form: React.FC<FormProps> = ({ children, form }) => {
    // FormProvider passes down react-hook-form context to nested components
    return <FormProvider {...form}>{children}</FormProvider>;
};

// --------------------------
// FormField: connect input component to react-hook-form
// --------------------------
// Usage: <FormField control={form.control} name="email" render={({ field }) => <Input {...field} />} />
interface FormFieldProps {
    control: Control<any>; // react-hook-form control
    name: string;          // field name in form
    render: ({ field }: any) => React.ReactNode; // render prop for custom input
}

export const FormField: React.FC<FormFieldProps> = ({ control, name, render }) => {
    return <Controller control={control} name={name} render={render} />;
};

// --------------------------
// FormItem: simple container for a form field
// --------------------------
export const FormItem: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <div className="flex flex-col">{children}</div>;
};

// --------------------------
// FormLabel: label for input field
// --------------------------
export const FormLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <label className="font-medium mb-1">{children}</label>;
};

// --------------------------
// FormControl: wrapper around input component (optional styling)
// --------------------------
export const FormControl: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <div>{children}</div>;
};

// --------------------------
// FormMessage: display error message for a field
// --------------------------
// Automatically reads errors from react-hook-form context
export const FormMessage: React.FC<{ name?: string }> = ({ name }) => {
    const { formState } = useFormContext(); // access form context
    const error = name ? formState.errors[name] : undefined; // get specific field error
    if (!error) return null;

    return <p className="text-red-500 text-sm">{(error as any)?.message}</p>;
};
