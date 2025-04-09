import localFont from 'next/font/local';

export const myCustomFont = localFont({
  src: [
    {
      path: '../public/fonts/Nohemi-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-my-custom'
})