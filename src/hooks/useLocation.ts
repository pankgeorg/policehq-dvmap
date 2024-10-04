import { useCallback, useState } from 'react';

export const useLocation = (): [
    Function,
    GeolocationCoordinates | null,
    GeolocationPositionError | null,
    Function,
] => {
    const [location, setLocation] = useState<GeolocationCoordinates | null>(null);
    const [error, setError] = useState<GeolocationPositionError | null>(null);
    const successCallback = (pos: GeolocationPosition) => {
        setLocation(pos.coords);
        setError(null);
    };
    const errorCallback = (err: GeolocationPositionError) => {
        setLocation(null);
        setError(err);
    };
    const request = useCallback(() => {
        navigator.geolocation.getCurrentPosition(successCallback, errorCallback, {
            enableHighAccuracy: true,
        });
    }, []);
    const reset = () => {
        setLocation(null);
        setError(null);
    };
    return [request, location, error, reset];
};
