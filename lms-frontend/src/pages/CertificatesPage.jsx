import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";

const CertificatesPage = () => {
  const [certs, setCerts] = useState([]);

  useEffect(() => {
    api
      .get("/learning/certificates/")
      .then(({ data }) => setCerts(data.results || data))
      .catch(() => toast.error("Could not load certificates"));
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Certificates</h1>
      <p className="text-sm text-white/50">
        Share the verification code with employers. Public verify URL (no login):{" "}
        <code className="text-cyan-300">/api/learning/certificates/verify/&lt;uuid&gt;/</code>
      </p>
      <div className="grid gap-3 md:grid-cols-2">
        {certs.map((c) => (
          <div key={c.id} className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
            <p className="font-medium text-emerald-200">{c.course_title}</p>
            <p className="text-xs text-white/50 mt-1">Issued {new Date(c.issued_at).toLocaleDateString()}</p>
            <p className="mt-2 break-all text-xs text-white/60">Code: {c.verification_code}</p>
          </div>
        ))}
      </div>
      {!certs.length && <p className="text-white/40 text-sm">No certificates yet.</p>}
    </div>
  );
};

export default CertificatesPage;
