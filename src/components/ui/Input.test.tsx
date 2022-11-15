import userEvent from '@testing-library/user-event';
import { useForm, ValidationRule } from 'react-hook-form';
import { render, screen, act } from '@testing-library/react';
import { Input } from './Input';

type Inputs = {
  testString: string;
};

type WrapperProps = {
  name: keyof Inputs;
  label: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  onlyNumbers?: boolean;
  pattern?: ValidationRule<RegExp>;
  spacesBetween?: boolean;
  sx?: Record<string, unknown>;
  fullWidth?: boolean;
  defaultValue?: string;
};

const Wrapper = (props: WrapperProps) => {
  const { control } = useForm<Inputs>({
    mode: 'onTouched',
  });

  return (
    <div>
      <Input
        control={control}
        {...props}
        defaultValue={props.defaultValue ?? ''}
      />
    </div>
  );
};

describe('Input', () => {
  test('Render input', () => {
    render(<Wrapper name="testString" label="Test String" />);

    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
  });

  test('Exists label for input', () => {
    render(<Wrapper name="testString" label="Test String" />);

    const labelElement = screen.getByLabelText('Test String');
    expect(labelElement).toBeInTheDocument();
  });

  test('Write in input abc', () => {
    render(<Wrapper name="testString" label="Test String" />);

    const input = screen.getByRole('textbox');
    userEvent.type(input, 'abc');

    const inputValue = screen.getByDisplayValue(/abc/);
    expect(inputValue).toBeInTheDocument();
  });

  test('Check default value', () => {
    render(
      <Wrapper
        name="testString"
        label="Test String"
        defaultValue="Test value"
      />
    );

    const inputValue = screen.getByDisplayValue(/Test value/);
    expect(inputValue).toBeInTheDocument();
  });

  test('Check required prop', async () => {
    render(<Wrapper name="testString" label="Test" />);

    const input = screen.getByRole('textbox');
    userEvent.click(input);
    userEvent.tab();

    const inputValue = await screen.findByText(/Test is invalid/);
    expect(inputValue).toBeInTheDocument();
  });

  test('Check minLength prop - with error', async () => {
    render(<Wrapper name="testString" label="Test" minLength={4} />);

    const input = screen.getByRole('textbox');
    userEvent.type(input, 'abc');
    userEvent.tab();

    const error = await screen.findByText(/Test is invalid/);
    expect(error).toBeInTheDocument();
  });

  test('Check minLength prop - without error', async () => {
    render(<Wrapper name="testString" label="Test" minLength={4} />);

    const input = screen.getByRole('textbox');

    userEvent.type(input, 'abcd');
    userEvent.tab();

    await act(async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 50);
      });
    });

    const error = screen.queryByText(/Test is invalid/);
    expect(error).not.toBeInTheDocument();
  });

  test('Check maxLength prop', async () => {
    render(<Wrapper name="testString" label="Test" maxLength={4} />);

    const input = screen.getByRole('textbox');
    userEvent.type(input, 'abcdef');
    userEvent.tab();

    await act(async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 50);
      });
    });

    const value = screen.getByDisplayValue(/^abcd$/);
    expect(value).toBeInTheDocument();
  });

  test('Check onlyNumbers prop', async () => {
    render(<Wrapper name="testString" label="Test" onlyNumbers={true} />);

    const input = screen.getByRole('textbox');
    userEvent.type(input, 'abc1dw4d6e');
    userEvent.tab();

    await act(async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 50);
      });
    });

    const value = screen.getByDisplayValue(/^146$/);
    expect(value).toBeInTheDocument();
  });

  test('Check spacesBetween prop', async () => {
    render(<Wrapper name="testString" label="Test" spacesBetween={true} />);

    const input = screen.getByRole('textbox');
    userEvent.type(input, '1111222233334444');
    userEvent.tab();

    await act(async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 50);
      });
    });

    const value = screen.getByDisplayValue(/^1{4} 2{4} 3{4} 4{4}$/);
    expect(value).toBeInTheDocument();
  });
});
