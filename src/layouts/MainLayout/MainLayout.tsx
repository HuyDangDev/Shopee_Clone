import { Footer, Header } from 'src/components'

interface Props {
  children?: React.ReactNode
}

export const MainLayout = ({ children }: Props) => {
  return (
    <div>
      <Header />
      {children}
      <Footer />
    </div>
  )
}
