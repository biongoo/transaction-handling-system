import {
  Controller,
  FieldValues,
  UseControllerProps,
  ValidationRule,
} from 'react-hook-form';
import TextField from '@mui/material/TextField';

type InputProps = {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  onlyNumbers?: boolean;
  pattern?: ValidationRule<RegExp>;
  spacesBetween?: boolean;
  sx?: Record<string, unknown>;
  fullWidth?: boolean;
};

type Props<T extends FieldValues> = UseControllerProps<T> & InputProps;

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
        pattern: props.pattern,
      }}
      render={({ field, fieldState: { error } }) => {
        return (
          <TextField
            {...field}
            sx={props.sx}
            id={field.name}
            type={props.type}
            label={props.label}
            fullWidth={props.fullWidth}
            error={Boolean(error)}
            helperText={Boolean(error) && `${props.label} is invalid`}
            onChange={(x) => {
              let value = x.target.value;
              const { maxLength, onlyNumbers, spacesBetween } = props;

              if (maxLength && value.length > maxLength) {
                return;
              }

              if (onlyNumbers) {
                value = allowOnlyNumber(value);
              }

              if (spacesBetween) {
                value = allowOnlyNumber(value)
                  .replace(/(.{4})/g, '$1 ')
                  .trim();
              }

              return field.onChange(value);
            }}
          />
        );
      }}
    />
  );
};

const allowOnlyNumber = (value: string) => {
  return value.replace(/\D/g, '');
};
