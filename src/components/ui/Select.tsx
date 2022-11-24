import {
  Box,
  ToggleButton,
  ToggleButtonGroup as ToggleButtonGroupMui,
  Typography,
} from '@mui/material';
import {
  Control,
  Controller,
  FieldValues,
  Path,
  PathValue,
  UseControllerProps,
} from 'react-hook-form';

type SelectProps<T extends FieldValues> = {
  name: string;
  title: string;
  control: Control<T>;
  defaultValue: PathValue<T, Path<T>>;
  options: Array<PathValue<T, Path<T>>>;
  fullWidth?: boolean;
};

type Props<T extends FieldValues> = UseControllerProps<T> & SelectProps<T>;

export const Select = <T extends FieldValues>(props: Props<T>) => {
  const { name, title, options, control, fullWidth, defaultValue } = props;

  const content = options.map((x) => (
    <ToggleButton key={`${name}-${x}`} value={x}>
      {x}
    </ToggleButton>
  ));

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field }) => (
        <Box>
          <Typography mb={1}>{title}:</Typography>
          <ToggleButtonGroupMui
            sx={{ margin: 'auto' }}
            {...field}
            id={name}
            exclusive
            color="primary"
            fullWidth={fullWidth}
            orientation="horizontal"
            defaultValue={defaultValue}
          >
            {content}
          </ToggleButtonGroupMui>
        </Box>
      )}
    />
  );
};
