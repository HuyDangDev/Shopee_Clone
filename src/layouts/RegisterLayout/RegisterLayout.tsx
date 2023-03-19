import { Footer, RegisterHeader } from 'src/components'

interface Props {
  children?: React.ReactNode
}

export const RegisterLayout = ({ children }: Props) => {
  return (
    <div>
      <RegisterHeader /> {children} <Footer />
    </div>
  )
}
