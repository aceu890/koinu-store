export default function Loading() {
  return (
    <div className="grid min-h-[40vh] place-items-center px-6" role="status" aria-label="Cargando">
      <span className="koinu-loader-ring h-10 w-10 rounded-full" />
    </div>
  );
}
