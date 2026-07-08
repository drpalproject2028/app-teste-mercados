"use client";

import { useState, useCallback } from "react";

interface GeolocationState {
  loading: boolean;
  error: string | null;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    loading: false,
    error: null,
  });

  const requestLocation = useCallback(
    (onSuccess: (lat: number, lon: number) => void) => {
      if (!navigator.geolocation) {
        setState({ loading: false, error: "Geolocalização não suportada" });
        return;
      }

      setState({ loading: true, error: null });

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setState({ loading: false, error: null });
          onSuccess(position.coords.latitude, position.coords.longitude);
        },
        (err) => {
          setState({
            loading: false,
            error:
              err.code === 1
                ? "Permissão de localização negada"
                : "Erro ao obter localização",
          });
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    },
    []
  );

  return { ...state, requestLocation };
}
