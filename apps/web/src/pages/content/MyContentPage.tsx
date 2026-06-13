import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deletePost, getMyPosts } from "../../services/contentService";

export default function MyContentPage() {
  const [posts, setPosts] = useState<any[]>([]);

  const load = async () => {
    const res = await getMyPosts();
    setPosts(res.data || []);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (uuid: string) => {
    if (!confirm("Delete this post?")) return;
    await deletePost(uuid);
    load();
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-slate-900">My Content</h1>
          <p className="mt-2 font-bold text-slate-500">
            Manage journals and newsletters created by you.
          </p>
        </div>

        <Link
          to="/content/create"
          className="rounded-2xl bg-blue-600 px-5 py-3 font-black text-white"
        >
          + Create Content
        </Link>
      </div>

      <div className="grid gap-5">
        {posts.map((post) => (
          <div
            key={post.uuid}
            className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex gap-2">
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-black text-blue-700">
                    {post.type.toUpperCase()}
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700">
                    {post.status.toUpperCase()}
                  </span>
                </div>

                <h2 className="mt-3 text-2xl font-black text-slate-900">
                  {post.title}
                </h2>

                <p className="mt-2 text-sm font-bold text-slate-500">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: post.excerpt || "No excerpt",
                    }}
                  />
                </p>
              </div>

              <div className="flex gap-2">
                <Link
                  to={`/content/author/${post.uuid}`}
                  className="rounded-xl bg-slate-100 px-4 py-2 font-black text-slate-700"
                >
                  View
                </Link>

                <Link
                  to={`/content/${post.uuid}/edit`}
                  className="rounded-xl bg-[#f5e8c8] px-4 py-2 text-sm font-black text-[#8b6914]"
                >
                  Edit
                </Link>

                <button
                  onClick={() => handleDelete(post.uuid)}
                  className="rounded-xl bg-red-600 px-4 py-2 font-black text-white"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {posts.length === 0 && (
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-10 text-center">
            <h2 className="text-2xl font-black text-slate-900">
              No content created yet
            </h2>
          </div>
        )}
      </div>
    </div>
  );
}
