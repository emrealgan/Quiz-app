import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })

export const metadata = 
{
  title: 'Quiz',
  description: 'Generated by create next app',
}

export default function RootLayout({ children }) 
{
  
  return (
    <html lang="en">
      <meta charSet="utf-8" />
      
      <body>
        {children}
      </body>
    </html>
  )
}
