import { useEffect, useState } from "react";
import { Flame, Loader2, Sparkles, Target } from "lucide-react";
import { getMyProgressLevel } from "../../services/progressService";

export default function ProgressLevelCard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLevel();
  }, []);

  const loadLevel = async () => {
    try {
      const res = await getMyProgressLevel();
      setData(res.data);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm">
        <Loader2 className="h-6 w-6 animate-spin text-orange-700" />
      </div>
    );
  }

  const level = data?.level;

  return (
    <div className="rounded-[2rem] border border-orange-100 bg-gradient-to-br from-orange-50 via-white to-yellow-50 p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-2xl bg-orange-100 p-3 text-orange-700">
          <Sparkles className="h-6 w-6" />
        </div>

        <div>
          <h2 className="text-2xl font-black text-slate-900">
            Your Spiritual Level
          </h2>
          <p className="text-sm font-semibold text-slate-500">
            Based on your last 30 days progress.
          </p>
        </div>
      </div>

      <div className="rounded-3xl bg-white p-5 shadow-sm">
        <p className="text-sm font-black uppercase text-orange-600">
          Current Level
        </p>

        <h3 className="mt-2 text-3xl font-black text-slate-900">
          {level?.name || "New Seeker"}
        </h3>

        <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">
          {level?.description || "Start recording your daily spiritual progress."}
        </p>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl bg-orange-50 p-4">
            <div className="flex items-center gap-2 text-orange-700">
              <Target className="h-5 w-5" />
              <span className="font-black">Score</span>
            </div>
            <p className="mt-2 text-2xl font-black text-slate-900">
              {data?.score || 0}
            </p>
          </div>

          <div className="rounded-2xl bg-yellow-50 p-4">
            <div className="flex items-center gap-2 text-yellow-700">
              <Flame className="h-5 w-5" />
              <span className="font-black">Mala Count</span>
            </div>
            <p className="mt-2 text-2xl font-black text-slate-900">
              {data?.last_30_days?.total_mala || 0}
            </p>
          </div>
        </div>

        {level?.recommendation_text && (
          <div className="mt-5 rounded-2xl bg-green-50 p-4">
            <p className="text-sm font-bold leading-6 text-green-800">
              {level.recommendation_text}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}