import userEvent from '@testing-library/user-event';
import { useForm } from 'react-hook-form';
import { render, screen, act } from '@testing-library/react';
import { DatePicker } from './DatePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

beforeAll(() => {
  // add window.matchMedia
  // this is necessary for the date picker to be rendered in desktop mode.
  // if this is not provided, the mobile mode is rendered, which might lead to unexpected behavior
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: unknown) => ({
      media: query,
      // this is the media query that @material-ui/pickers uses to determine if a device is a desktop device
      matches: query === '(pointer: fine)',
      onchange: () => {
        /* */
      },
      addEventListener: () => {
        /* */
      },
      removeEventListener: () => {
        /* */
      },
      addListener: () => {
        /* */
      },
      removeListener: () => {
        /* */
      },
      dispatchEvent: () => false,
    }),
  });
});

/* afterAll(() => {
    delete window.matchMedia;
}); */

type Inputs = {
  testDate: Date | null;
};

type WrapperProps = {
  name: keyof Inputs;
  label: string;
  required?: boolean;
  defaultValue?: Date;
};

const Wrapper = (props: WrapperProps) => {
  const { control } = useForm<Inputs>({
    mode: 'onTouched',
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        control={control}
        {...props}
        defaultValue={props.defaultValue}
      />
    </LocalizationProvider>
  );
};

describe('DatePicker', () => {
  test('Check write date', async () => {
    render(<Wrapper name="testDate" label="Test" />);

    const input = screen.getByRole('textbox');
    userEvent.type(input, '111123');
    userEvent.tab();

    await act(async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 50);
      });
    });

    const value = screen.getByDisplayValue('11/11/23');
    expect(value).toBeInTheDocument();
  });

  test('Check error', async () => {
    render(<Wrapper name="testDate" label="Test" />);

    const input = screen.getByRole('textbox');
    userEvent.click(input);
    userEvent.tab();

    await act(async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 50);
      });
    });

    const value = screen.getByText('Test is invalid');
    expect(value).toBeInTheDocument();
  });
});
