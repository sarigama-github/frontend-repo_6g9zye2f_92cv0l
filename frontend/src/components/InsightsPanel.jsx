import { useEffect, useState } from "react";
import { Brain } from "lucide-react";

export default function InsightsPanel({ tasks }) {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        const base = import.meta.env.VITE_BACKEND_URL;
        const res = await fetch(`${base}/ai/suggest`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tasks }),
        });
        if (res.ok) {
          const data = await res.json();
          setTips(data.suggestions || []);
        } else {
          setTips([]);
        }
      } catch (e) {
        setTips([]);
      } finally {
        setLoading(false);
      }
    };
    if (tasks.length) run();
    else setTips([]);
  }, [tasks]);

  return (
    <aside className="rounded-xl border bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <Brain className="h-5 w-5 text-purple-600" />
        <h3 className="font-semibold">AI Insights</h3>
      </div>
      <div className="mt-3 space-y-2">
        {loading ? (
          <p className="text-sm text-gray-500">Analyzing your tasks…</p>
        ) : tips.length ? (
          tips.map((t, i) => (
            <div key={i} className="text-sm text-gray-700 bg-purple-50 border border-purple-200 rounded-md p-2">
              {t}
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">Add tasks to see suggestions on what to do next.</p>
        )}
      </div>
    </aside>
  );
}
