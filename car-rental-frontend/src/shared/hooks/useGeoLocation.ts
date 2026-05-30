import { useState, useEffect, useCallback } from 'react';

interface GeoLocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
}

export function useGeoLocation(): GeoLocationState {
  const [state, setState] = useState<GeoLocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: true,
  });

  const onSuccess = useCallback((position: GeolocationPosition) => {
    setState({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      error: null,
      loading: false,
    });
  }, []);

  const onError = useCallback((error: GeolocationPositionError) => {
    setState({
      latitude: null,
      longitude: null,
      error: error.message,
      loading: false,
    });
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      setState((s) => ({ ...s, error: 'Geolocation is not supported by your browser', loading: false }));
      return;
    }

    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  }, [onSuccess, onError]);

  return state;
}
