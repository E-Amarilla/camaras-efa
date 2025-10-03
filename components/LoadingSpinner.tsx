import { useTranslation } from "react-i18next";

interface LoadingSpinnerProps {
  fullScreen?: boolean;
}

export default function LoadingSpinner({
}: LoadingSpinnerProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="flex flex-col items-center gap-3">
        <div className="animate-spin rounded-full border-4 border-t-transparent border-white w-12 h-12" />
        <span className="text-white font-semibold tracking-wider">
          {t("min.cargando")}
        </span>
      </div>
    </div>
  );
}
