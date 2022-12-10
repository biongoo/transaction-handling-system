import TextField, { TextFieldProps } from '@mui/material/TextField';
import { DatePicker as DatePickerMUI } from '@mui/x-date-pickers';
import { Controller, FieldValues, UseControllerProps } from 'react-hook-form';

type DatePickerProps = {
  name: string;
  label: string;
  maxDate?: Date;
  minDate?: Date;
  required?: boolean;
  disablePast?: boolean;
  shouldDisableDate?: (day: Date) => boolean;
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
            disablePast={props.disablePast}
            maxDate={props.maxDate}
            minDate={props.minDate}
            shouldDisableDate={props.shouldDisableDate}
            renderInput={(params: JSX.IntrinsicAttributes & TextFieldProps) => (
              <TextField
                {...params}
                onBlur={field.onBlur}
                error={Boolean(error)}
                helperText={Boolean(error) && `${props.label} is invalid`}
              />
            )}
          />
        );
      }}
    />
  );
};
