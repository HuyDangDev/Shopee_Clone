import { forwardRef, InputHTMLAttributes, useState } from 'react'

export interface InputNumberProps extends InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string
  classNameInput?: string
  classNameError?: string
}

export const InputNumber = forwardRef<HTMLInputElement, InputNumberProps>(function InputNumberInner(
  {
    errorMessage,
    className,
    classNameError = 'mt-1 text-red-600 text-sm min-h-[1rem]',
    classNameInput = 'p-3 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm',
    onChange,
    value = '',
    ...rest
  },
  ref
) {
  const [localValue, setLocalValue] = useState(value as string)
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value = '1' } = event.target
    if (/^\d+$/.test(value) || value === '') {
      // Thuc hien onChange callback tu ben ngoai truyen vao props
      onChange && onChange(event)

      //Cap nhat localValue state
      setLocalValue(value)
    }
  }

  return (
    <div>
      <div className={className}>
        <input className={classNameInput} onChange={handleChange} {...rest} ref={ref} value={value || localValue} />
        <div className={classNameError}>{errorMessage}</div>
      </div>
    </div>
  )
})
