import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import { type LatLngExpression, marker, icon, LatLngTuple } from 'leaflet';
import './Map.css';
import png from './marker-icon-red.png';
import { OfficePopup } from './OfficePopup';
import { type PoliceDepartment } from '../../hooks/usePoliceDepartmentLocationDataHook';
import { useEffect, useMemo } from 'react';

const redMarker = icon({
    iconUrl: png,
    // shadowUrl: shadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

const MapDataHandler = ({
    defaultPosition,
    setClosest,
    data,
    closest,
}: {
    data?: Array<PoliceDepartment>;
    closest: PoliceDepartment | null;
    defaultPosition?: GeolocationCoordinates;
    setClosest: Function;
}) => {
    const map = useMap();
    const coords = [
        defaultPosition?.latitude,
        defaultPosition?.longitude,
    ] as LatLngTuple;
    useEffect(() => {
        if (map && defaultPosition) {
            if (data) {
                let y = (data as Array<PoliceDepartment>).map((datum) => {
                    const pointTo = { lat: datum.lat, lng: datum.lon };
                    return Math.round(map.distance(coords, pointTo));
                });
                const min = Math.min(...y);
                //ts-ignore next-line
                const closest = (data as Array<PoliceDepartment>)[y.indexOf(min)];
                setClosest(closest);
                const closestLatLng = [closest.lat, closest.lon];
                map.flyToBounds([coords as LatLngTuple, closestLatLng as LatLngTuple]);
                const newMarker = marker({
                    lat: closest.lat,
                    lng: closest.lon,
                }).addTo(map);
                return () => {
                    newMarker.removeFrom(map);
                };
            }
        }
        const policeDepartment = (data as Array<PoliceDepartment>)[0];
        if (policeDepartment && policeDepartment)
            map.flyTo({ lat: policeDepartment.lat, lng: policeDepartment.lon }, 11);
    }, [map, defaultPosition, data]);
    if (!defaultPosition)
        return <Marker icon={redMarker} position={[0, 0]} key="user"></Marker>;
    console.log({ closest });
    return (
        <>
            {closest && (
                <Marker position={[closest.lat, closest.lon]} key={`closest-map`}>
                    <OfficePopup department={closest as unknown as PoliceDepartment} />
                </Marker>
            )}
            <Marker icon={redMarker} position={coords} key="user">
                <Popup>
                    Η τοποθεσία σας (ακριβής στα{' '}
                    {Math.round(defaultPosition?.accuracy / 100) * 100}μ)
                </Popup>
            </Marker>
        </>
    );
};

const Map = ({
    data,
    defaultPosition,
    closest,
    setClosest,
}: {
    data: Array<PoliceDepartment>;
    defaultPosition?: GeolocationCoordinates;
    closest: PoliceDepartment | null;
    setClosest: Function;
}) => {
    const first = data[0];
    if (!data || !first) {
        return 'loading...';
    }
    const position: LatLngExpression = [first.lat, first.lon];
    const markers = useMemo(
        () =>
            data.map(({ lon, lat, ...rest }) => (
                <Marker position={[lat, lon]} key={`${lon},${lat}-map`}>
                    <OfficePopup department={{ ...rest, lon, lat }} />
                </Marker>
            )),
        [data]
    );
    return (
        <div className="map">
            <MapContainer center={position} zoom={7}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {markers}
                <MapDataHandler
                    closest={closest}
                    data={data}
                    setClosest={setClosest}
                    defaultPosition={defaultPosition}
                />
            </MapContainer>
        </div>
    );
};

export default Map;
