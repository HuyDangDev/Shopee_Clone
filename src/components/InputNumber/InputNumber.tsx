import { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string
  classNameInput?: string
  classNameError?: string
}

export const Input = (props: InputProps) => {
  const {
    errorMessage,
    className,
    classNameError = 'mt-1 text-red-600 text-sm min-h-[1rem]',
    classNameInput = 'p-3 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm',
    onChange,
    ...rest
  } = props

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    if ((/^\d+$/.test(value) || value === '') && onChange) {
      onChange(event)
    }
  }

  return (
    <div>
      <div className={className}>
        <input className={classNameInput} onChange={handleChange} {...rest} />
        <div className={classNameError}>{errorMessage}</div>
      </div>
    </div>
  )
}
