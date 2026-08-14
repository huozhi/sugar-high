import CaptureClient from './capture-client'
import './capture.css'

export const metadata = {
  title: 'Code capture — Sugar High',
  description: 'A URL-driven, client-side code screenshot surface.',
}

export default function CapturePage() {
  return <CaptureClient />
}
