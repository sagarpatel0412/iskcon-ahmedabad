import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ImagePlus, Plus, Trash2 } from "lucide-react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import {
  getPost,
  getAuthorPost,
  updatePost,
  getProgressLevels,
} from "../../services/contentService";
import "../../styles/ckeditor.css";
import AppLoader from "../../components/common/AppLoader";

type MediaItem = {
  uuid?: string;
  media_type: "image" | "video" | "pdf" | "audio";
  file_url: string;
  thumbnail_url: string;
  title: string;
  sort_order: number;
  is_featured: boolean;
};

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function EditContentPage() {
  const { uuid } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    slug: "",
    type: "journal",
    visibility: "free",
    access_type: "free",
    excerpt: "",
    content: "",
    cover_image_url: "",
    thumbnail_url: "",
    banner_image_url: "",
    price_amount: 0,
    currency: "INR",
    target_level_id: null,
  });

  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [levels, setLevels] =useState([])

    const loadLevels = async () => {
      try {
        const res = await getProgressLevels();
  
        setLevels(res.data || []);
      } catch (error) {
        console.error("Failed to load levels", error);
      }
    };
  
    useEffect(() => {
      loadLevels();
    },[])

  useEffect(() => {
    loadPost();
  }, [uuid]);

  const loadPost = async () => {
    try {
      const res = await getAuthorPost(uuid!);
      const post = res.data;

      setForm({
        title: post.title || "",
        slug: post.slug || "",
        type: post.type || "journal",
        visibility: post.visibility || "free",
        access_type: post.access_type || "free",
        excerpt: post.excerpt || "",
        content: post.content || "",
        cover_image_url: post.cover_image_url || "",
        thumbnail_url: post.thumbnail_url || "",
        banner_image_url: post.banner_image_url || "",
        price_amount: Number(post.price_amount || 0),
        currency: post.currency || "INR",
        target_level_id: post.target_level.id,
      });

      setMedia(
        post.media?.length
          ? post.media.map((item: any, index: number) => ({
              uuid: item.uuid,
              media_type: item.media_type || "image",
              file_url: item.file_url || "",
              thumbnail_url: item.thumbnail_url || "",
              title: item.title || "",
              sort_order: item.sort_order || index + 1,
              is_featured: Boolean(item.is_featured),
            }))
          : [
              {
                media_type: "image",
                file_url: "",
                thumbnail_url: "",
                title: "",
                sort_order: 1,
                is_featured: false,
              },
            ],
      );
    } finally {
      setPageLoading(false);
    }
  };

  const update = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateMedia = (index: number, key: keyof MediaItem, value: any) => {
    setMedia((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [key]: value } : item)),
    );
  };

  const addMedia = () => {
    setMedia((prev) => [
      ...prev,
      {
        media_type: "image",
        file_url: "",
        thumbnail_url: "",
        title: "",
        sort_order: prev.length + 1,
        is_featured: false,
      },
    ]);
  };

  const removeMedia = (index: number) => {
    setMedia((prev) => prev.filter((_, i) => i !== index));
  };

  const submit = async (status: "draft" | "published" | "archived") => {
    try {
      setLoading(true);

      const cleanMedia = media
        .filter((item) => item.file_url.trim())
        .map((item, index) => ({
          ...item,
          sort_order: Number(item.sort_order || index + 1),
        }));

      const res = await updatePost(uuid!, {
        ...form,
        status,
        price_amount: Number(form.price_amount || 0),
        media: cleanMedia,
      });

      navigate(`/content/${res.data.post?.uuid || uuid}`);
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <AppLoader
        title="Loading Content"
        subtitle="Fetching spiritual wisdom..."
      />
    );
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8 overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#1a0a00] to-[#3d2200] p-8 text-white shadow-xl">
        <p className="text-sm font-black uppercase tracking-[0.3em] text-[#d4a853]">
          ISKCON Ahmedabad CMS
        </p>
        <h1 className="mt-3 text-4xl font-black">Edit Journal / Newsletter</h1>
        <p className="mt-3 max-w-2xl font-bold text-[#d4a853]">
          Update spiritual content, media, pricing and publishing status.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <Section title="Basic Details">
            <div className="grid gap-5 md:grid-cols-2">
              <Input
                label="Title *"
                value={form.title}
                onChange={(v) => update("title", v)}
              />
              <Input
                label="Slug"
                value={form.slug}
                onChange={(v) => update("slug", v)}
              />

              <Select
                label="Type"
                value={form.type}
                onChange={(v) => update("type", v)}
              >
                <option value="journal">Journal</option>
                <option value="newsletter">Newsletter</option>
                <option value="article">Article</option>
                <option value="announcement">Announcement</option>
              </Select>

              <Select
                label="Visibility"
                value={form.visibility}
                onChange={(v) => update("visibility", v)}
              >
                <option value="free">Free</option>
                <option value="paid">Paid</option>
              </Select>
              <Select
                label="Target Level"
                value={form.target_level_id || ''}
                onChange={(v:any) =>
                  update("target_level_id", v)
                }
              >
                <option value="">All Levels</option>
                {levels.map((level: any) => (
                  <option key={level.id} value={level.id}>
                    {level.name}
                  </option>
                ))}
              </Select>
            </div>
          </Section>

          <Section title="Excerpt">
            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <CKEditor
                editor={ClassicEditor as any}
                data={form.excerpt}
                onChange={(_, editor: any) =>
                  update("excerpt", editor.getData())
                }
              />
            </div>
          </Section>

          <Section title="Main Content">
            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <CKEditor
                editor={ClassicEditor as any}
                data={form.content}
                onChange={(_, editor: any) =>
                  update("content", editor.getData())
                }
              />
            </div>
          </Section>

          <Section title="Multiple Media">
            <div className="space-y-4">
              {media.map((item, index) => (
                <div
                  key={index}
                  className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#f5e8c8] text-[#8b6914]">
                        <ImagePlus className="h-5 w-5" />
                      </div>
                      <h3 className="font-black text-slate-900">
                        Media #{index + 1}
                      </h3>
                    </div>

                    {media.length > 1 && (
                      <button
                        onClick={() => removeMedia(index)}
                        className="rounded-xl bg-red-50 p-2 text-red-600 hover:bg-red-100"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <Select
                      label="Media Type"
                      value={item.media_type}
                      onChange={(v) => updateMedia(index, "media_type", v)}
                    >
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                      <option value="pdf">PDF</option>
                      <option value="audio">Audio</option>
                    </Select>

                    <Input
                      label="Title"
                      value={item.title}
                      onChange={(v) => updateMedia(index, "title", v)}
                    />
                    <Input
                      label="File URL *"
                      value={item.file_url}
                      onChange={(v) => updateMedia(index, "file_url", v)}
                    />
                    <Input
                      label="Thumbnail URL"
                      value={item.thumbnail_url}
                      onChange={(v) => updateMedia(index, "thumbnail_url", v)}
                    />
                    <Input
                      label="Sort Order"
                      type="number"
                      value={String(item.sort_order)}
                      onChange={(v) =>
                        updateMedia(index, "sort_order", Number(v))
                      }
                    />

                    <label className="flex items-center gap-3 pt-8">
                      <input
                        type="checkbox"
                        checked={item.is_featured}
                        onChange={(e) =>
                          updateMedia(index, "is_featured", e.target.checked)
                        }
                        className="h-5 w-5 rounded border-slate-300"
                      />
                      <span className="font-black text-slate-700">
                        Featured media
                      </span>
                    </label>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addMedia}
                className="flex items-center gap-2 rounded-2xl bg-[#f5e8c8] px-5 py-3 font-black text-[#8b6914] hover:bg-[#ede0c8]"
              >
                <Plus className="h-5 w-5" />
                Add More Media
              </button>
            </div>
          </Section>
        </div>

        <div className="space-y-6">
          <Section title="Images">
            <div className="space-y-4">
              <Input
                label="Cover Image URL"
                value={form.cover_image_url}
                onChange={(v) => update("cover_image_url", v)}
              />
              <Input
                label="Thumbnail URL"
                value={form.thumbnail_url}
                onChange={(v) => update("thumbnail_url", v)}
              />
              <Input
                label="Banner Image URL"
                value={form.banner_image_url}
                onChange={(v) => update("banner_image_url", v)}
              />

              {form.banner_image_url && (
                <img
                  src={form.banner_image_url}
                  className="h-48 w-full rounded-3xl object-cover"
                />
              )}
            </div>
          </Section>

          <Section title="Pricing">
            <div className="space-y-4">
              <Select
                label="Access Type"
                value={form.access_type}
                onChange={(v) => update("access_type", v)}
              >
                <option value="free">Free</option>
                <option value="subscription">Subscription</option>
                <option value="one_time">One Time Purchase</option>
                <option value="subscription_or_one_time">
                  Subscription or One Time
                </option>
              </Select>

              <Input
                label="Price Amount"
                type="number"
                value={String(form.price_amount)}
                onChange={(v) => update("price_amount", Number(v))}
              />
              <Input
                label="Currency"
                value={form.currency}
                onChange={(v) => update("currency", v)}
              />
            </div>
          </Section>

          <div className="sticky top-24 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-black text-slate-900">
              Update Actions
            </h3>

            <div className="mt-5 grid gap-3">
              <button
                disabled={loading}
                onClick={() => submit("draft")}
                className="rounded-2xl bg-slate-900 px-5 py-3 font-black text-white hover:bg-slate-800 disabled:opacity-60"
              >
                Save Draft
              </button>

              <button
                disabled={loading}
                onClick={() => submit("published")}
                className="rounded-2xl bg-[#c8902a] px-5 py-3 font-black text-[#1a0a00] hover:bg-[#d4a853] disabled:opacity-60"
              >
                Publish Update
              </button>

              <button
                disabled={loading}
                onClick={() => submit("archived")}
                className="rounded-2xl bg-red-50 px-5 py-3 font-black text-red-700 hover:bg-red-100 disabled:opacity-60"
              >
                Archive
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-2xl font-black text-slate-900">{title}</h2>
      {children}
    </section>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-black text-slate-700">{label}</span>
      <input
        type={type}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-bold text-slate-800 outline-none focus:border-[#c8902a]"
      />
    </label>
  );
}

function Select({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-black text-slate-700">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-bold text-slate-800 outline-none focus:border-[#c8902a]"
      >
        {children}
      </select>
    </label>
  );
}
