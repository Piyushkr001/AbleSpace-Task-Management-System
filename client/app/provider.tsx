import { ThemeProvider } from '@/components/theme-provider'
import React from 'react'

function Provider({ children } : any) {
  return (
    <div>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </div>
  )
}

export default Provider