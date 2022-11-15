import { Controller, FieldValues, UseControllerProps } from 'react-hook-form';
import DatePickerMUI from '@mui/lab/DatePicker';
import TextField, { TextFieldProps } from '@mui/material/TextField';

type DatePickerProps = {
    name: string;
    label: string;
    required?: boolean;
};

type Props<T extends FieldValues> = UseControllerProps<T> & DatePickerProps;

export const DatePicker = <T extends FieldValues>(props: Props<T>) => {
    return (
        <Controller
            name={props.name}
            control={props.control}
            defaultValue={props.defaultValue}
            rules={{
                required: props.required ?? true,
            }}
            render={({ field, fieldState: { error } }) => {
                return (
                    <DatePickerMUI
                        {...field}
                        label={props.label}
                        value={field.value || null}
                        renderInput={(params: JSX.IntrinsicAttributes & TextFieldProps) => (
                            <TextField
                                {...params}
                                onBlur={field.onBlur}
                                error={Boolean(error)}
                                helperText={
                                    Boolean(error) &&
                                    `${props.label} is invalid`
                                }
                            />
                        )}
                    />
                );
            }}
        />
    );
};
