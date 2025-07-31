/* eslint-disable no-unused-vars */
import '@testing-library/jest-dom';

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveTextContent(_text: string | RegExp): R;
      toHaveAttribute(_attr: string, _value?: string): R;
      toHaveClass(..._classNames: string[]): R;
      toHaveStyle(_style: Record<string, unknown> | string): R;
      toBeVisible(): R;
      toBeDisabled(): R;
      toBeEnabled(): R;
      toBeChecked(): R;
      toHaveValue(_value: string | number): R;
      toHaveDisplayValue(_value: string | RegExp | Array<string | RegExp>): R;
      toBeRequired(): R;
      toBeInvalid(): R;
      toBeValid(): R;
      toHaveFocus(): R;
    }
  }
} 