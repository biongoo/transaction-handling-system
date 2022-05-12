import { Controller, FieldValues, UseControllerProps } from 'react-hook-form';
import TextField from '@mui/material/TextField';

type InputProps = {
    name: string;
    label: string;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    onlyNumbers?: boolean;
};

type Props<T extends FieldValues> = & UseControllerProps<T> & InputProps;

export const Input = <T extends FieldValues>(props: Props<T>) => {
    return (
        <Controller
            name={props.name}
            control={props.control}
            defaultValue={props.defaultValue}
            rules={{
                required: props.required ?? true,
                minLength: props.minLength ?? 3,
                maxLength: props.maxLength ?? 100,
            }}
            render={({ field, fieldState: { error } }) => {
                return (
                    <TextField
                        {...field}
                        id={field.name}
                        label={props.label}
                        error={Boolean(error)}
                        helperText={Boolean(error) && `${props.label} is invalid`}
                        onChange={x => {
                            if (props.maxLength && x.target.value.length > props.maxLength) {
                                return;
                            }

                            if (props.onlyNumbers) {
                                return field.onChange(
                                    allowOnlyNumber(
                                        x.target.value
                                    )
                                );
                            }

                            return field.onChange(x.target.value);
                        }}
                    />
                );
            }}
        />
    );
};

const allowOnlyNumber = (value: string) => {
    return value.replace(/[^\d]/g, '');
};
