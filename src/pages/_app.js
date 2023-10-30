import Head from 'next/head'
import { Router } from 'next/router'
import toast, { Toaster } from 'react-hot-toast'

import NProgress from 'nprogress'

import { CacheProvider } from '@emotion/react'

import themeConfig from 'src/configs/themeConfig'

import UserLayout from 'src/layouts/UserLayout'
import ThemeComponent from 'src/@core/theme/ThemeComponent'

// ** Contexts
import { SettingsConsumer, SettingsProvider } from 'src/@core/context/settingsContext'

// ** Utils Imports
import { createEmotionCache } from 'src/@core/utils/create-emotion-cache'

// ** React Perfect Scrollbar Style
import 'react-perfect-scrollbar/dist/css/styles.css'

// ** Global css styles
import '../../styles/globals.css'
import { Account } from 'src/service/Account'

const clientSideEmotionCache = createEmotionCache()

// ** Pace Loader
if (themeConfig.routingLoader) {
  Router.events.on('routeChangeStart', () => {
    NProgress.start()
  })
  Router.events.on('routeChangeError', () => {
    NProgress.done()
  })
  Router.events.on('routeChangeComplete', () => {
    NProgress.done()
  })
}

// ** Configure JSS & ClassName
const App = props => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props

  // Variables
  const getLayout = Component.getLayout ?? (page => <UserLayout>{page}</UserLayout>)

  return (
    <>
      <CacheProvider value={emotionCache}>
        <Head>
          <title>{`${themeConfig.templateName}`}</title>
          <meta name='description' content={`${themeConfig.templateName}`} />
          <meta name='keywords' content='Car Dealer, Car Admin Portal' />
          <meta name='viewport' content='initial-scale=1, width=device-width' />
        </Head>
        <Toaster
          toastOptions={{
            className: '',
            style: {
              // border: '1px solid white',//
              padding: '16px',
              color: 'white',
              background: '#312d4b'
            }
          }}
        />
        <Account>
          <SettingsProvider>
            <SettingsConsumer>
              {({ settings }) => {
                return <ThemeComponent settings={settings}>{getLayout(<Component {...pageProps} />)}</ThemeComponent>
              }}
            </SettingsConsumer>
          </SettingsProvider>
        </Account>
      </CacheProvider>
    </>
  )
}

export default App
