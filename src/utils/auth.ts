import { User } from 'src/types'

export const saveAccessTokenToLS = (access_token: string) => {
  localStorage.setItem('access_token', access_token)
}

export const clearAccountInfoFromLS = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('profile')
}

export const getAccessTokenFromLS = () => {
  return localStorage.getItem('access_token') || ''
}

export const getProfile = () => {
  const profileFromLS = localStorage.getItem('profile')
  return profileFromLS ? JSON.parse(profileFromLS) : null
}

export const setProfile = (profile: User) => {
  return localStorage.setItem('profile', JSON.stringify(profile))
}
