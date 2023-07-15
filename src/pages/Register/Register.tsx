import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { omit } from 'lodash'
import { useContext } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { authApi } from 'src/apis/auth.api'
import { Button } from 'src/components'
import { Input } from 'src/components/Input'
import { PATH } from 'src/constants'
import { AppContext } from 'src/contexts'
import { ErrorResponseApi } from 'src/types'
import { Schema, schema } from 'src/utils/rules'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'

type FormData = Omit<Schema, 'price_min' | 'price_max'>

const registerSchema = schema.pick(['email', 'password', 'confirm_password'])

export const Register = () => {
  const { setIsAuthenticated, setProfile } = useContext(AppContext)
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(registerSchema)
  })

  const registerAccountMutation = useMutation({
    mutationFn: (body: Omit<Schema, 'confirm_password'>) => authApi.registerAccount(body)
  })
  const handleSubmitFormRegister = handleSubmit((data) => {
    const body = omit(data, 'confirm_password')
    registerAccountMutation.mutate(body, {
      onSuccess: (data) => {
        setProfile(data?.data?.data?.user)
        setIsAuthenticated(true)
        toast.success('Register Success')
        navigate('/')
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntityError<ErrorResponseApi<FormData>>(error)) {
          const formError = error.response?.data?.data

          if (formError) {
            Object.keys(formError).forEach((key) => {
              setError(key as keyof FormData, {
                message: formError[key as keyof FormData],
                type: 'Server'
              })
            })
          }
        }
      }
    })
  })

  return (
    <div className='bg-orange'>
      <div className='container'>
        <div className='grid grid-cols-1 py-12 lg:grid-cols-5 lg:py-32 lg:pr-10'>
          <div className='lg:col-span-2 lg:col-start-4'>
            <form className='rounded bg-white p-10 shadow-sm' onSubmit={handleSubmitFormRegister} noValidate>
              <div className='text-2xl'>Đăng Ký</div>

              <Input
                type='email'
                name='email'
                placeholder='Email'
                className='mt-8'
                register={register}
                errorMessage={errors.email?.message}
                autoComplete='on'
              ></Input>

              <Input
                type='password'
                name='password'
                placeholder='Password'
                className='mt-3'
                register={register}
                errorMessage={errors.password?.message}
              ></Input>

              <Input
                type='password'
                name='confirm_password'
                placeholder='Confirm Password'
                className='mt-3'
                register={register}
                errorMessage={errors.confirm_password?.message}
              ></Input>

              <div className='mt-3'>
                <Button
                  className='w-full bg-red-500 py-4 px-2 text-center text-sm uppercase text-white hover:bg-red-600'
                  isLoading={registerAccountMutation.isLoading}
                  disabled={registerAccountMutation.isLoading}
                >
                  Đăng Ký
                </Button>
              </div>
              <div className='mt-8 text-center'>Bằng việc đăng kí, bạn đã đồng ý với Shopee về & </div>
              <div className='mt-8 flex items-center justify-center'>
                <span className='text-gray-400'>Bạn đã có tài khoản?</span>
                <Link className='ml-1 text-red-400' to={PATH.login}>
                  Đăng Nhập
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
