 

  useEffect(() => {
    const load = async () => {
      try {
        const adminKey = getAdminKeyFromStorage();
        const res = await fetch("/api/admin/contact", {
          headers: adminKey ? { "x-admin-key": adminKey } : {},
        });

        if (!res.ok) {
          throw new Error("Access denied");
        }

        const data = await res.json();
        setSubmissions(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load contact submissions");
        clearAdminKey();
        router.push("/admin/login");
        return;
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [router]);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getHuntTypeLabel = (type: string) => {
    if (type === "Self-Guided") return "Self-Guided";
    if (type === "Fully Guided (Professional Guide + Trained Dogs)") return "Fully Guided";
    return type;
  };

  if (loading) {
    return <AdminLoadingState label="Contact submissions" />;
  }

  if (error) {
    return <p className="p-6 text-red-600">{error}</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-black">Contact Submissions</h2>
          <p className="mt-1 text-sm text-black/70">
            {submissions.length} submission{submissions.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {submissions.length === 0 ? (
        <div className="rounded-2xl border border-black/10 bg-white px-8 py-12 text-center shadow-[0_12px_28px_rgba(0,0,0,0.06)]">
          <p className="text-black/60">No contact submissions yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {submissions.map((submission) => (
            <div
              key={submission.id}
              className="rounded-2xl border border-black/10 bg-white shadow-[0_12px_28px_rgba(0,0,0,0.06)] overflow-hidden transition-all"
            >
              {/* Header / Summary Row */}
              <div
                className="flex cursor-pointer flex-col gap-3 px-5 py-4 hover:bg-[#fffaf4] sm:flex-row sm:items-center sm:justify-between"
                onClick={() => toggleExpand(submission.id)}
              >
                <div className="flex flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-black">
                      {submission.firstName} {submission.lastName}
                    </span>
                    <span className="text-sm text-black/40">•</span>
                    <a
                      href={`mailto:${submission.email}`}
                      className="text-sm text-orange-600 hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {submission.email}
                    </a>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <span className="rounded-full bg-orange-50 px-2.5 py-0.5 text-xs font-medium text-orange-700">
                      {getHuntTypeLabel(submission.huntType)}
                    </span>
                    <span className="text-black/40">•</span>
                    <span className="text-black/60">
                      {submission.minGroupSize}-{submission.maxGroupSize} hunters
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm text-black/50">
                  <span>{formatDate(submission.createdAt)}</span>
                  <svg
                    className={`h-5 w-5 transform transition-transform text-black/30 ${expandedId === submission.id ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedId === submission.id && (
                <div className="border-t border-black/5 px-5 py-4 bg-[#faf8f6]">
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wide text-black/40">Hunt Details</h4>
                      <div className="mt-1 space-y-1 text-sm">
                        <p>
                          <span className="text-black/50">Hunt Type:</span>{" "}
                          <span className="font-medium text-black">{submission.huntType}</span>
                        </p>
                        <p>
                          <span className="text-black/50">Experience:</span>{" "}
                          <span className="font-medium text-black">{submission.experience || "Not specified"}</span>
                        </p>
                        <p>
                          <span className="text-black/50">Group Size:</span>{" "}
                          <span className="font-medium text-black">
                            {submission.minGroupSize} - {submission.maxGroupSize} hunters
                          </span>
                        </p>
                        <p>
                          <span className="text-black/50">Dog Power:</span>{" "}
                          <span className="font-medium text-black">{submission.dogPower || "Not specified"}</span>
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wide text-black/40">Preferred Weeks</h4>
                      <div className="mt-1 space-y-1 text-sm">
                        <p>
                          <span className="text-black/50">1st Choice:</span>{" "}
                          <span className="font-medium text-black">{submission.firstChoice || "Not selected"}</span>
                        </p>
                        <p>
                          <span className="text-black/50">2nd Choice:</span>{" "}
                          <span className="font-medium text-black">{submission.secondChoice || "Not selected"}</span>
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wide text-black/40">Contact Info</h4>
                      <div className="mt-1 space-y-1 text-sm">
                        <p>
                          <span className="text-black/50">Phone:</span>{" "}
                          <a
                            href={`tel:${submission.phone}`}
                            className="font-medium text-orange-600 hover:underline"
                          >
                            {submission.phone || "Not provided"}
                          </a>
                        </p>
                        <p>
                          <span className="text-black/50">State/Province:</span>{" "}
                          <span className="font-medium text-black">{submission.stateProvince || "Not specified"}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {submission.additionalComments && (
                    <div className="mt-4">
                      <h4 className="text-xs font-bold uppercase tracking-wide text-black/40">Additional Comments</h4>
                      <p className="mt-1 text-sm text-black/80 bg-white rounded-lg border border-black/5 px-3 py-2">
                        {submission.additionalComments}
                      </p>
                    </div>
                  )}

                  <div className="mt-4 flex items-center gap-4 text-xs text-black/30">
                    <span>Created: {formatDate(submission.createdAt)}</span>
                    <span>•</span>
                    <span>Updated: {formatDate(submission.updatedAt)}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}