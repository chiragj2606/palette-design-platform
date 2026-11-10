
import { useCallback, useEffect, useState } from "react";
import "./AdminDashboard.css";

const API =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const STAT_ITEMS = [
  { key: "totalUsers", label: "Registered users", icon: "◎" },
  { key: "totalDesigns", label: "Published designs", icon: "▧" },
  { key: "totalComments", label: "Comments", icon: "☰" },
  { key: "totalLikes", label: "Likes", icon: "♡" },
  { key: "totalFollows", label: "Follow relationships", icon: "↗" },
  { key: "totalSaves", label: "Saved references", icon: "⌑" },
  { key: "newUsersLast7Days", label: "New users · 7 days", icon: "+" },
];

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatNumber(value) {
  return new Intl.NumberFormat("en-IN").format(Number(value) || 0);
}

export default function AdminDashboard({ token }) {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOverview = useCallback(async () => {
    if (!token) {
      setError("Please log in to access the dashboard.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API}/admin/overview`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Could not load dashboard information."
        );
      }

      setOverview(result);
    } catch (err) {
      setError(
        err.message || "Could not connect to the PALETTE backend."
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadOverview();
  }, [loadOverview]);

  return (
    <section className="inner-page admin-dashboard-page">
      <div className="admin-dashboard-heading">
        <div>
          <div className="section-overline">
            PALETTE / ADMINISTRATION
          </div>

          <h1 className="inner-heading">
            The bigger<br />
            <em>picture.</em>
          </h1>

          <p className="inner-intro">
            Your overview of the people, projects, and activity
            shaping the PALETTE community.
          </p>
        </div>

        <button
          type="button"
          className="button-outline admin-refresh-button"
          onClick={loadOverview}
          disabled={loading}
        >
          {loading ? "REFRESHING..." : "↻ REFRESH DATA"}
        </button>
      </div>

      {loading && !overview ? (
        <div className="status-panel admin-status-panel">
          <strong>Gathering the picture...</strong>
          <p>Loading current information from PALETTE.</p>
        </div>
      ) : error && !overview ? (
        <div className="status-panel status-error admin-status-panel">
          <strong>Dashboard unavailable.</strong>
          <p>{error}</p>
          <button type="button" onClick={loadOverview}>
            TRY AGAIN ↗
          </button>
        </div>
      ) : overview ? (
        <>
          {error && (
            <p className="admin-inline-error" role="alert">
              Refresh failed: {error}
            </p>
          )}

          <div className="admin-section-heading">
            <div>
              <span className="section-overline">
                COMMUNITY PULSE
              </span>
              <h2>PALETTE at a glance</h2>
            </div>

            <span className="admin-live-label">
              <span aria-hidden="true" />
              LIVE DATABASE COUNTS
            </span>
          </div>

          <div className="admin-stats-grid">
            {STAT_ITEMS.map((item, index) => (
              <article
                className={`admin-stat-card ${
                  index === 0 ? "admin-stat-featured" : ""
                }`}
                key={item.key}
              >
                <div className="admin-stat-top">
                  <span className="admin-stat-icon" aria-hidden="true">
                    {item.icon}
                  </span>
                  <span className="admin-stat-index">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <strong className="admin-stat-value">
                  {formatNumber(overview.stats?.[item.key])}
                </strong>

                <span className="admin-stat-label">
                  {item.label}
                </span>
              </article>
            ))}
          </div>

          <div className="admin-activity-grid">
            <section className="admin-panel">
              <div className="admin-panel-heading">
                <div>
                  <span className="section-overline">
                    THE COMMUNITY
                  </span>
                  <h2>Recent members</h2>
                </div>
                <span className="admin-panel-count">
                  {overview.recentUsers?.length || 0} shown
                </span>
              </div>

              {overview.recentUsers?.length ? (
                <div className="admin-table-scroll">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>MEMBER</th>
                        <th>ROLE</th>
                        <th>JOINED</th>
                      </tr>
                    </thead>

                    <tbody>
                      {overview.recentUsers.map((member) => (
                        <tr key={member._id}>
                          <td>
                            <div className="admin-member">
                              {member.profileImage ? (
                                <img
                                  className="admin-avatar"
                                  src={member.profileImage}
                                  alt=""
                                />
                              ) : (
                                <span className="admin-avatar admin-avatar-fallback">
                                  {(member.name || member.username || "P")
                                    .charAt(0)
                                    .toUpperCase()}
                                </span>
                              )}

                              <div className="admin-member-details">
                                <strong>
                                  {member.name || member.username}
                                </strong>
                                <span>
                                  @{member.username || "unknown"}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td>
                            <span
                              className={`admin-role-pill ${
                                member.role === "admin"
                                  ? "admin-role-pill-admin"
                                  : ""
                              }`}
                            >
                              {member.role || "user"}
                            </span>
                          </td>

                          <td className="admin-date">
                            {formatDate(member.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="admin-empty-state">
                  No members to display yet.
                </p>
              )}
            </section>

            <section className="admin-panel">
              <div className="admin-panel-heading">
                <div>
                  <span className="section-overline">
                    CREATIVE OUTPUT
                  </span>
                  <h2>Latest projects</h2>
                </div>

                <span className="admin-panel-count">
                  {overview.recentDesigns?.length || 0} shown
                </span>
              </div>

              {overview.recentDesigns?.length ? (
                <div className="admin-project-list">
                  {overview.recentDesigns.map((design) => (
                    <article
                      className="admin-project-row"
                      key={design._id}
                    >
                      {design.imageUrl ? (
                        <img
                          className="admin-project-image"
                          src={design.imageUrl}
                          alt=""
                        />
                      ) : (
                        <div className="admin-project-image admin-project-placeholder">
                          P.
                        </div>
                      )}

                      <div className="admin-project-details">
                        <strong>{design.title}</strong>
                        <span>
                          {design.category || "Uncategorised"}
                        </span>
                        <span>
                          By{" "}
                          {design.creator?.username ||
                            design.creator?.name ||
                            "Unknown creator"}
                        </span>
                      </div>

                      <div className="admin-project-meta">
                        <span>♡ {formatNumber(design.likes)}</span>
                        <time>{formatDate(design.createdAt)}</time>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="admin-empty-state">
                  No published projects yet.
                </p>
              )}
            </section>
          </div>

          <p className="admin-dashboard-footnote">
            Statistics are calculated from the PALETTE database.
            Recent activity shows the latest five records in each list.
          </p>
        </>
      ) : null}
    </section>
  );
}
