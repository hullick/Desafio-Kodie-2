import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { ApiError } from '../services/ApiError'
import { errorRoute, type ErrorRouteState } from '../services/errorRoute'

/**
 * Devolve uma função que leva para a tela de erro certa quando recebe um `ApiError`.
 * Retorna `true` se navegou; `false` se o erro não tem tela (o chamador decide o que fazer).
 * A página que falhou é substituída no histórico: "voltar" vai para a anterior e
 * "Tentar novamente" reabre a que falhou.
 */
export function useApiErrorRedirect() {
  const navigate = useNavigate()
  const { pathname, search } = useLocation()

  return useCallback(
    (err: unknown): boolean => {
      const to = errorRoute(err)
      if (!to) return false
      const state: ErrorRouteState = {
        from: pathname + search,
        status: err instanceof ApiError ? err.status : null,
      }
      navigate(to, { replace: true, state })
      return true
    },
    [navigate, pathname, search],
  )
}

/** Lê, na tela de erro, de onde o usuário veio (padrão: início). */
export function useErrorRouteState(): ErrorRouteState {
  const state = useLocation().state as Partial<ErrorRouteState> | null
  return { from: state?.from ?? '/', status: state?.status ?? null }
}
