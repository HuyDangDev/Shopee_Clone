import * as yup from 'yup'

export const schema = yup.object({
  email: yup
    .string()
    .required('Email la bat buoc')
    .email('Email khong dung dinh dang')
    .min(5, 'Do dai tu 5 - 160 ky tu')
    .max(160, 'Do dai tu 5 - 160 ky tu'),
  password: yup
    .string()
    .required('Password la bat buoc')
    .min(6, 'Do dai tu 6 - 160 ky tu')
    .max(160, 'Do dai tu 6 - 160 ky tu'),
  confirm_password: yup
    .string()
    .required('Confirm password la bat buoc')
    .min(6, 'Do dai tu 6 - 160 ky tu')
    .max(160, 'Do dai tu 6 - 160 ky tu')
    .oneOf([yup.ref('password')], 'Confirm password is wrong')
})

export type Schema = yup.InferType<typeof schema>
