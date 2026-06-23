import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  ImagePlus,
  Loader2,
  Package,
  Trash2,
  UploadCloud,
} from "lucide-react";
import {
  deleteShopProductImage,
  getShopProductByUuid,
  uploadShopProductImage,
} from "../../../services/shopService";

export default function AdminShopProductImagesPage() {
  const { uuid } = useParams();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const res = await getShopProductByUuid(uuid!);
      setProduct(res.data);
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [uuid]);

  const uploadImage = async (file: File) => {
    try {
      setUploading(true);
      await uploadShopProductImage(uuid!, file);
      await load();
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = async (image: any) => {
    if (!confirm("Delete this product image?")) return;

    try {
      await deleteShopProductImage(image.uuid);
      await load();
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to delete image");
    }
  };

  const imageUrl = (url: string) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return `http://localhost:3000${url}`;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fdfaf5]">
        <Loader2 className="h-8 w-8 animate-spin text-[#c8902a]" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#fdfaf5] p-5">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl font-black text-[#1a0a00]">
            Product Images
          </h1>
          <p className="mt-1 text-sm font-bold text-[#9a7a4a]">
            Manage images for {product?.title}.
          </p>
        </div>

        <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-[#c8902a] px-5 py-3 font-black text-[#1a0a00] hover:bg-[#d4a853]">
          {uploading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <UploadCloud size={18} />
          )}
          Upload Image
          <input
            type="file"
            hidden
            accept="image/png,image/jpeg,image/jpg,image/webp"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) uploadImage(file);
            }}
          />
        </label>
      </div>

      {!product?.images?.length ? (
        <div className="rounded-3xl border border-dashed border-[#ede0c8] bg-white p-12 text-center">
          <ImagePlus className="mx-auto h-12 w-12 text-[#c8902a]" />
          <h2 className="mt-4 font-serif text-3xl font-black text-[#1a0a00]">
            No images uploaded
          </h2>
          <p className="mt-2 text-sm font-bold text-[#9a7a4a]">
            Upload product images for better shop display.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {product.images.map((image: any) => (
            <div
              key={image.uuid}
              className="overflow-hidden rounded-3xl border border-[#ede0c8] bg-white shadow-sm"
            >
              <div className="h-56 bg-[#f5e8c8]">
                {image.image_url ? (
                  <img
                    src={imageUrl(image.image_url)}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Package className="h-12 w-12 text-[#c8902a]" />
                  </div>
                )}
              </div>

              <div className="p-4">
                <div className="mb-3 flex gap-2">
                  {image.is_primary && (
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                      Primary
                    </span>
                  )}

                  <span className="rounded-full bg-[#f5e8c8] px-3 py-1 text-xs font-black text-[#8b6914]">
                    Order {image.sort_order}
                  </span>
                </div>

                <button
                  onClick={() => removeImage(image)}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-50 px-4 py-3 text-sm font-black text-red-600"
                >
                  <Trash2 size={16} />
                  Delete Image
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}