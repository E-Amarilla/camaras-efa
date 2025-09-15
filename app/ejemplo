"use client";

import { useState, useEffect } from "react";
import { DateRangePicker } from "@nextui-org/react";
import Botones from "../botones/botonesdescarga/botonesdescarga.jsx";
import BotonFiltro from "../botones/aplicarfiltro/botonfiltro.jsx";
import style from "./FiltroPeriodo.module.css";
import { useTranslation } from "react-i18next";

const FiltroPeriodo = ({ onDataUpdate, onStartLoading }) => {
    const { t } = useTranslation('trad');
    const storedUser = sessionStorage.getItem('user_data');
    const token = storedUser ? JSON.parse(storedUser).access_token : null;

    const today = new Date();
    const formattedToday = today.toISOString().split("T")[0];

    const [dateRange, setDateRange] = useState({ start: formattedToday, end: formattedToday });
    const [loading, setLoading] = useState(false);

    const formatDate = (date) => {
        if (!date) return null;
        const year = date.year;
        const month = String(date.month).padStart(2, "0");
        const day = String(date.day).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const fetchInitialData = async () => {
        const startDate = formattedToday;
        const endDate = formattedToday;

        setLoading(true);
        try {
            const response = await fetch(
                `http://${process.env.NEXT_PUBLIC_IP}:${process.env.NEXT_PUBLIC_PORT}/productividad/resumen?fecha_inicio=${startDate}&fecha_fin=${endDate}`,
                {
                    method: "GET",
                    
                    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
                }
            );

            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }

            const data = await response.json();
            onDataUpdate(data, startDate, endDate);
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    const handleDateChange = (range) => {
        setDateRange(range);
    };

    const handleButtonClick = async () => {
        const startDate = formatDate(dateRange.start) || formattedToday;
        const endDate = formatDate(dateRange.end) || formattedToday;

        onStartLoading();

        setLoading(true);
        try {
            const response = await fetch(
                `http://${process.env.NEXT_PUBLIC_IP}:${process.env.NEXT_PUBLIC_PORT}/productividad/resumen?fecha_inicio=${startDate}&fecha_fin=${endDate}`,
                {
                    method: "GET",
                    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
                }
            );

            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }

            const data = await response.json();
            onDataUpdate(data, startDate, endDate);
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInitialData();
    }, []);

    return (
        <div className={`${style.contenedor} FiltroPeriodo`}>
            <h2 className={style.titulo}>{t('mayus.filtradoFechaProductividad')}</h2>
            <div className="h-full flex flex-col items-center gap-5 rounded-lg">
                <div className="flex flex-col items-center w-full">
                    <div className={style.datePickerGlobal}>
                        <DateRangePicker
                            label={t('min.seleccionaPeriodo')}
                            classNames={{
                                base: style.customDateRangePicker,
                                trigger: style.datePickerTrigger,
                                popover: style.datePickerPopover,
                                input: style.input,
                            }}
                            onChange={handleDateChange}
                        />
                    </div>
                    <div className="min-w-[6rem] w-[13vw] max-w-full pt-2">
                        <BotonFiltro onClick={handleButtonClick}/>
                    </div>
                </div>
            </div>
            <div className="h-full flex flex-col items-center gap-5 rounded-lg">
                <div className="min-w-[6rem] w-[13vw] max-w-full">
                    <Botones startDate={dateRange.start} endDate={dateRange.end}/>
                </div>
            </div>
        </div>
    );
};

export default FiltroPeriodo;