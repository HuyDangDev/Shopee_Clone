import { useForm } from 'react-hook-form'
import { schema, Schema, isAxiosUnprocessableEntityError } from 'src/utils'
import { yupResolver } from '@hookform/resolvers/yup'
import { Input } from 'src/components/Input'
import { useMutation } from '@tanstack/react-query'
import { authApi } from 'src/apis/auth.api'
import { ErrorResponseApi } from 'src/types'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useContext } from 'react'
import { AppContext } from 'src/contexts'
import { Button } from 'src/components'
import { PATH } from 'src/constants'
type FormData = Omit<Schema, 'confirm_password'>

const loginSchema = schema.omit(['confirm_password'])
export const Login = () => {
  const { setIsAuthenticated, setProfile } = useContext(AppContext)
  const navigate = useNavigate()
  const {
    register,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(loginSchema)
  })

  const loginMutation = useMutation({
    mutationFn: (body: FormData) => authApi.loginAccount(body)
  })

  const handleSubmitFormLogin = handleSubmit((data) => {
    loginMutation.mutate(data, {
      onSuccess: (data) => {
        setIsAuthenticated(true)
        setProfile(data.data?.data?.user)
        toast.success('Login Success')
        navigate('/')
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntityError<ErrorResponseApi<FormData>>(error)) {
          const formError = error.response?.data.data

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
        <div className='grid grid-cols-1 lg:grid-cols-5 py-12 lg:py-32 lg:pr-10'>
          <div className='lg:col-span-2 lg:col-start-4'>
            <form className='p-10 rounded bg-white shadow-sm' onSubmit={handleSubmitFormLogin} noValidate>
              <div className='text-2xl'>Đăng Nhập</div>

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

              <div className='mt-3'>
                <Button
                  className='w-full text-center py-4 px-2 uppercase bg-red-500 text-white text-sm hover:bg-red-600'
                  isLoading={loginMutation.isLoading}
                  disabled={loginMutation.isLoading}
                >
                  Đăng Nhập
                </Button>
              </div>
              <div className='flex items-center justify-center mt-8'>
                <span className='text-gray-400'>Bạn chưa có tài khoản?</span>
                <Link className='text-red-400 ml-1' to={PATH.register}>
                  Đăng Ký
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
