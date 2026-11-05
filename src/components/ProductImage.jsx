const fallbackImage = "/img/products/imagen_inicio.jpg";

export default function ProductImage({
  product,
  alt,
  className = "",
  width,
  height,
  loading = "lazy",
}) {
  const image = product?.imagen?.replace(/^\./, "") || fallbackImage;

  return (
    <img
      className={className}
      src={image}
      alt={alt ?? product?.nombre ?? ""}
      width={width}
      height={height}
      loading={loading}
    />
  );
}
