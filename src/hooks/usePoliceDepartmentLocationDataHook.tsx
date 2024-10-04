import { useCallback, useEffect, useState } from 'react';

export type PoliceDepartment = {
    'ΓΡΑΦΕΙΟ ΑΝΤΙΜΕΤΩΠΙΣΗΣ ΕΝΔΟΟΙΚΟΓΕΝΕΙΑΚΗΣ ΒΙΑΣ': string;
    ΤΗΛΕΦΩΝΟ: string;
    'ΤΗΛΕΦΩΝΟ 2': string;
    email: string;
    'Google Maps Link': string;
    ΔΙΕΥΘΥΝΣΗ: string;
    'ΔΙΕΥΘΥΝΣΗ ΑΣΤΥΝΟΜΙΑΣ': string;
    lon: number;
    lat: number;
    id: number;
};

const dataURL = `https://docs.google.com/spreadsheets/d/e/2PACX-1vTPicZ8zN2wMiXGdj76W4oOyO-xQiIl47jJ8kD-SQgQgHgYyzpIOyngJNBzcN1mFphpNvGLTVwBBNPe/pub?gid=0&single=true&output=tsv`;
export const usePoliceDepartmentLocationDataHook = (): [
    Boolean,
    Array<PoliceDepartment>,
    object | null,
    Function,
    PoliceDepartment | null,
    Function,
] => {
    const [data, setData] = useState<Array<PoliceDepartment>>([]);
    const [loading, setLoading] = useState(false);
    const [closest, setClosest] = useState(null);
    const [err, setError] = useState(null);
    const reload = useCallback(() => {
        setLoading(true);
        setClosest(null);
        fetch(dataURL)
            .then((response) => response.text(), setError)
            .then((text) => {
                if (!text) {
                    return;
                }
                const [header, ...lines] = text.split('\n');
                const keys = header.split('\t');
                const data = lines
                    .map((line: string) => {
                        const items = line.split('\t');
                        return keys.reduce(
                            (acc, currentKey: string, currentIndex: number) => {
                                (acc as any)[currentKey] = items[currentIndex];
                                return acc;
                            },
                            {}
                        );
                    })
                    .map(({ lon, lat, ...rest }: any) => ({
                        ...rest,
                        lon: +lon.replace(',', '.'),
                        lat: +lat.replace(',', '.'),
                    }));
                setLoading(false);
                setData(data);
            }, setError);
    }, []);
    useEffect(reload, []);
    return [loading, data, err, reload, closest, setClosest];
};
