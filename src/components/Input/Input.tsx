import { InputHTMLAttributes } from 'react'
import type { RegisterOptions, UseFormRegister } from 'react-hook-form'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string
  classNameInput?: string
  classNameError?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register?: UseFormRegister<any>
  rules?: RegisterOptions
  autoComplete?: string
}

export const Input = (props: InputProps) => {
  const {
    type,
    errorMessage,
    placeholder,
    className,
    name,
    register,
    rules,
    autoComplete,
    classNameError = 'mt-1 text-red-600 text-sm min-h-[1rem]',
    classNameInput = 'p-3 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
  } = props

  const registerResult = register && name ? register(name, rules) : {}
  return (
    <div>
      <div className={className}>
        <input
          type={type}
          className={classNameInput}
          placeholder={placeholder}
          autoComplete={autoComplete}
          {...registerResult}
        />
        <div className={classNameError}>{errorMessage}</div>
      </div>
    </div>
  )
}
