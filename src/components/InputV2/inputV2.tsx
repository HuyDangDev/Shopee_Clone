import { InputHTMLAttributes, useState } from 'react';
import { FieldPath, FieldValues, UseControllerProps, useController } from 'react-hook-form';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  classNameInput?: string;
  classNameError?: string;
}

export const InputV2 = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(
  props: UseControllerProps<TFieldValues, TName> & InputProps
) => {
  const {
    type,
    onChange,
    className,
    value = '',
    classNameError = 'mt-1 text-red-600 text-sm min-h-[1rem]',
    classNameInput = 'p-3 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm',
    ...rest
  } = props;
  const { field, fieldState } = useController(props);
  const [localValue, setLocalValue] = useState<string>(field.value);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const valueFromInput = event.target.value;
    const numberCondition = type === 'number' && type === 'text';

    if (numberCondition || type !== 'number') {
      setLocalValue(valueFromInput);
      field.onChange(event);

      onChange && onChange(event);
    }
  };

  return (
    <div>
      <div className={className}>
        <input className={classNameInput} {...rest} {...field} onChange={handleChange} value={value || localValue} />
        <div className={classNameError}>{fieldState.error?.message}</div>
      </div>
    </div>
  );
};
