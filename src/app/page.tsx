'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'

type FacingMode = 'environment' | 'user'

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const [status, setStatus] = useState<'idle' | 'starting' | 'running' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState<string>('')
  const [negative, setNegative] = useState(true)
  const [facing, setFacing] = useState<FacingMode>('environment')
  const [mirror, setMirror] = useState(false)

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }, [])

  const startCamera = useCallback(
    async (mode: FacingMode) => {
      setStatus('starting')
      setErrorMsg('')
      stopStream()

      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error('Seu navegador não suporta acesso à câmera.')
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: mode },
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
          audio: false,
        })

        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play().catch(() => {})
        }
        setStatus('running')
      } catch (err) {
        const e = err as Error
        let msg = e.message || 'Não foi possível acessar a câmera.'
        if (e.name === 'NotAllowedError' || e.name === 'SecurityError') {
          msg = 'Permissão de câmera negada. Autorize no navegador e tente novamente.'
        } else if (e.name === 'NotFoundError' || e.name === 'DevicesNotFoundError') {
          msg = 'Nenhuma câmera encontrada neste dispositivo.'
        } else if (e.name === 'NotReadableError') {
          msg = 'A câmera está em uso por outro app. Feche-o e tente novamente.'
        }
        setErrorMsg(msg)
        setStatus('error')
      }
    },
    [stopStream],
  )

  const toggleCamera = () => {
    if (status === 'running') {
      stopStream()
      setStatus('idle')
    } else {
      startCamera(facing)
    }
  }

  const flipCamera = () => {
    const next: FacingMode = facing === 'environment' ? 'user' : 'environment'
    setFacing(next)
    setMirror(next === 'user')
    if (status === 'running') {
      startCamera(next)
    }
  }

  useEffect(() => {
    return () => {
      stopStream()
    }
  }, [stopStream])

  // Inline style string so we can dynamically build the CSS filter
  const filterStyle = negative ? 'invert(1) hue-rotate(180deg)' : 'none'

  const videoTransform = mirror ? 'scaleX(-1)' : 'none'

  return (
    <main
      className="relative w-full min-h-[100dvh] bg-black text-white overflow-hidden flex flex-col"
      style={{
        // respect iOS safe areas
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)',
      }}
    >
      {/* Video stage */}
      <div className="relative flex-1 w-full flex items-center justify-center overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
          style={{
            filter: filterStyle,
            transform: videoTransform,
            // ensure video element never shows black border
            background: '#000',
          }}
        />

        {/* Idle / Start overlay */}
        {status !== 'running' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-6 text-center bg-gradient-to-b from-zinc-900/95 via-black to-zinc-900/95">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Mazola Effect
              </h1>
              <p className="text-sm sm:text-base text-zinc-300 max-w-md">
                Toque em iniciar e aponte a câmera para o quadro. Vamos inverter as cores em tempo real para revelar a pintura original.
              </p>
            </div>

            <Button
              size="lg"
              onClick={toggleCamera}
              disabled={status === 'starting'}
              className="h-14 px-8 text-base sm:text-lg rounded-full bg-white text-black hover:bg-zinc-200 disabled:opacity-50"
            >
              {status === 'starting'
                ? 'Iniciando…'
                : status === 'error'
                  ? 'Tentar novamente'
                  : 'Iniciar câmera'}
            </Button>

            {status === 'error' && errorMsg && (
              <Alert variant="destructive" className="max-w-md bg-red-950/80 border-red-800 text-red-100">
                <AlertDescription>{errorMsg}</AlertDescription>
              </Alert>
            )}

            <p className="text-[11px] sm:text-xs text-zinc-500 max-w-xs">
              Funciona melhor em Chrome ou Safari no celular. É preciso permitir o acesso à câmera.
            </p>
          </div>
        )}

        {/* Top floating controls when running */}
        {status === 'running' && (
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-3 z-10">
            <span className="text-xs sm:text-sm bg-black/50 backdrop-blur px-3 py-1 rounded-full">
              {facing === 'environment' ? 'Câmera traseira' : 'Câmera frontal'}
            </span>
            <button
              onClick={flipCamera}
              aria-label="Trocar câmera"
              className="bg-black/50 backdrop-blur hover:bg-black/70 rounded-full p-3 transition active:scale-95"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 7v6h6" />
                <path d="M21 17v-6h-6" />
                <path d="M3 13a9 9 0 0 0 15 6" />
                <path d="M21 11A9 9 0 0 0 6 5" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Bottom control bar */}
      {status === 'running' && (
        <div className="w-full bg-black/90 backdrop-blur border-t border-zinc-800 px-4 py-4 flex items-center justify-between gap-4">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <Switch checked={negative} onCheckedChange={setNegative} />
            <span className="text-sm">Negativo</span>
          </label>

          <Button
            variant="destructive"
            onClick={toggleCamera}
            className="h-12 px-6 rounded-full"
          >
            Parar
          </Button>
        </div>
      )}
    </main>
  )
}
