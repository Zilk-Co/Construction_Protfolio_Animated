import { AdminLayout } from "@/components/layout/AdminLayout";
import { useGetSettings, useUpdateSettings, useChangeAdminPassword } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Save, RotateCcw, Lock, Eye, EyeOff } from "lucide-react";

const FIELDS = [
  { key: "phone", label: "Phone Number", placeholder: "+92 21 3456 7890", type: "text" },
  { key: "email", label: "Email Address", placeholder: "info@zainmanzoor.co", type: "email" },
  { key: "address", label: "Office Address", placeholder: "House 53, Street 12, Naval Colony, Sector 2, Baldia, Hub River Road, Karachi, Pakistan", type: "textarea" },
  { key: "city", label: "City", placeholder: "Karachi", type: "text" },
  { key: "hours", label: "Business Hours", placeholder: "Mon–Sat, 9:00 AM – 6:00 PM PKT", type: "text" },
  { key: "heroSubtitle", label: "Contact Page Subtitle", placeholder: "We deliver landmark architectural projects...", type: "textarea" },
] as const;

type SettingsKey = typeof FIELDS[number]["key"];

export default function AdminSettings() {
  const { data: settings, isLoading } = useGetSettings();
  const updateMutation = useUpdateSettings();
  const changePassword = useChangeAdminPassword();
  const [form, setForm] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [pwError, setPwError] = useState("");
  const [pwSaved, setPwSaved] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  useEffect(() => {
    if (settings) {
      setForm({
        phone: settings.phone ?? "",
        email: settings.email ?? "",
        address: settings.address ?? "",
        city: settings.city ?? "",
        hours: settings.hours ?? "",
        heroSubtitle: settings.heroSubtitle ?? "",
      });
    }
  }, [settings]);

  const handleChange = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({ data: form }, {
      onSuccess: () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      },
    });
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPwError("");
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwError("New passwords do not match");
      return;
    }
    if (pwForm.newPassword.includes(" ")) {
      setPwError("Password cannot contain spaces");
      return;
    }
    if (pwForm.newPassword.length < 4) {
      setPwError("New password must be at least 4 characters");
      return;
    }
    changePassword.mutate(
      { data: { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword } },
      {
        onSuccess: () => {
          setPwSaved(true);
          setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
          setTimeout(() => setPwSaved(false), 4000);
        },
        onError: () => setPwError("Current password is incorrect"),
      }
    );
  };

  const handleReset = () => {
    if (settings) {
      setForm({
        phone: settings.phone ?? "",
        email: settings.email ?? "",
        address: settings.address ?? "",
        city: settings.city ?? "",
        hours: settings.hours ?? "",
        heroSubtitle: settings.heroSubtitle ?? "",
      });
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-end mb-10 pb-6 border-b border-[hsl(220,15%,18%)]">
        <div>
          <p className="text-[10px] tracking-[0.35em] uppercase mb-1" style={{ color: "hsl(38,72%,52%)" }}>Configuration</p>
          <h1 className="text-3xl font-serif font-bold uppercase tracking-tight text-white">Site Settings</h1>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-16 bg-[hsl(220,18%,11%)] border border-[hsl(220,15%,18%)] animate-pulse" />
          ))}
        </div>
      ) : (
        <>
        <form id="settings-form" onSubmit={handleSubmit} className="pb-24">
          <div className="grid grid-cols-1 gap-6 mb-10">
            {/* Contact Info Section */}
            <div>
              <p className="text-[10px] tracking-[0.3em] uppercase text-gray-500 mb-4">Contact Information</p>
              <div className="space-y-4">
                {FIELDS.map(field => (
                  <motion.div
                    key={field.key}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <label className="block text-[10px] tracking-[0.25em] uppercase text-gray-400 mb-2">
                      {field.label}
                    </label>
                    {field.type === "textarea" ? (
                      <textarea
                        value={form[field.key as SettingsKey] ?? ""}
                        onChange={e => handleChange(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        rows={3}
                        className="w-full border px-4 py-3 text-sm focus:outline-none transition-colors resize-none placeholder:text-gray-600 text-white"
                        style={{ backgroundColor: "hsl(220,18%,12%)", borderColor: "hsl(220,15%,24%)" }}
                        onFocus={e => (e.currentTarget.style.borderColor = "hsl(38,72%,52%)")}
                        onBlur={e => (e.currentTarget.style.borderColor = "hsl(220,15%,24%)")}
                      />
                    ) : (
                      <input
                        type={field.type}
                        value={form[field.key as SettingsKey] ?? ""}
                        onChange={e => handleChange(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        className="w-full border px-4 py-3 text-sm focus:outline-none transition-colors placeholder:text-gray-600 text-white"
                        style={{ backgroundColor: "hsl(220,18%,12%)", borderColor: "hsl(220,15%,24%)" }}
                        onFocus={e => (e.currentTarget.style.borderColor = "hsl(38,72%,52%)")}
                        onBlur={e => (e.currentTarget.style.borderColor = "hsl(220,15%,24%)")}
                      />
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </form>
        {createPortal(
          <div className="flex items-center gap-4 border-t border-[hsl(220,15%,18%)] fixed bottom-0 left-[224px] right-0 bg-[hsl(220,18%,9%)]/95 backdrop-blur-md px-8 py-4 z-50">
            <button
              type="submit"
              form="settings-form"
              disabled={updateMutation.isPending}
              className="inline-flex items-center gap-2 px-6 py-3 text-xs tracking-[0.2em] uppercase font-bold transition-colors disabled:opacity-50"
              style={{ backgroundColor: "hsl(38,72%,52%)", color: "hsl(220,18%,9%)" }}
              onMouseEnter={e => { if (!updateMutation.isPending) e.currentTarget.style.backgroundColor = "hsl(38,72%,62%)"; }}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = "hsl(38,72%,52%)")}
            >
              <Save size={13} />
              {updateMutation.isPending ? "Saving..." : "Save Settings"}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-5 py-3 text-xs tracking-[0.2em] uppercase text-gray-500 hover:text-white border border-[hsl(220,15%,22%)] hover:border-[hsl(220,15%,35%)] transition-colors"
            >
              <RotateCcw size={12} />
              Reset
            </button>
            {saved && (
              <motion.span
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="text-xs tracking-widest uppercase"
                style={{ color: "hsl(38,72%,58%)" }}
              >
                ✓ Settings saved
              </motion.span>
            )}
          </div>,
          document.body
        )}
        </>
      )}
      {/* Password Change */}
      <div className="mt-12 pt-10 border-t border-[hsl(220,15%,18%)]">
        <div className="flex items-center gap-3 mb-6">
          <Lock size={14} className="text-[hsl(220,12%,45%)]" />
          <p className="text-[10px] tracking-[0.3em] uppercase text-gray-500">Change Admin Password</p>
        </div>

        <form onSubmit={handlePasswordChange} className="max-w-md space-y-4">
          {/* Current Password */}
          <div>
            <label className="block text-[10px] tracking-[0.25em] uppercase text-gray-400 mb-2">Current Password</label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                value={pwForm.currentPassword}
                onChange={e => setPwForm(p => ({ ...p, currentPassword: e.target.value }))}
                required
                className="w-full border px-4 py-3 pr-10 text-sm focus:outline-none transition-colors text-white"
                style={{ backgroundColor: "hsl(220,18%,12%)", borderColor: "hsl(220,15%,24%)" }}
                onFocus={e => (e.currentTarget.style.borderColor = "hsl(38,72%,52%)")}
                onBlur={e => (e.currentTarget.style.borderColor = "hsl(220,15%,24%)")}
              />
              <button type="button" onClick={() => setShowCurrent(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400">
                {showCurrent ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-[10px] tracking-[0.25em] uppercase text-gray-400 mb-2">New Password</label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                value={pwForm.newPassword}
                onChange={e => setPwForm(p => ({ ...p, newPassword: e.target.value }))}
                required
                className="w-full border px-4 py-3 pr-10 text-sm focus:outline-none transition-colors text-white"
                style={{ backgroundColor: "hsl(220,18%,12%)", borderColor: "hsl(220,15%,24%)" }}
                onFocus={e => (e.currentTarget.style.borderColor = "hsl(38,72%,52%)")}
                onBlur={e => (e.currentTarget.style.borderColor = "hsl(220,15%,24%)")}
              />
              <button type="button" onClick={() => setShowNew(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400">
                {showNew ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-[10px] tracking-[0.25em] uppercase text-gray-400 mb-2">Confirm New Password</label>
            <input
              type="password"
              value={pwForm.confirmPassword}
              onChange={e => setPwForm(p => ({ ...p, confirmPassword: e.target.value }))}
              required
              className="w-full border px-4 py-3 text-sm focus:outline-none transition-colors text-white"
              style={{ backgroundColor: "hsl(220,18%,12%)", borderColor: "hsl(220,15%,24%)" }}
              onFocus={e => (e.currentTarget.style.borderColor = "hsl(38,72%,52%)")}
              onBlur={e => (e.currentTarget.style.borderColor = "hsl(220,15%,24%)")}
            />
          </div>

          {pwError && <p className="text-red-400 text-xs">{pwError}</p>}

          <div className="flex items-center gap-4 pt-2">
            <button
              type="submit"
              disabled={changePassword.isPending}
              className="inline-flex items-center gap-2 px-6 py-3 text-xs tracking-[0.2em] uppercase font-bold transition-colors disabled:opacity-50"
              style={{ backgroundColor: "hsl(38,72%,52%)", color: "hsl(220,18%,9%)" }}
              onMouseEnter={e => { if (!changePassword.isPending) e.currentTarget.style.backgroundColor = "hsl(38,72%,62%)"; }}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = "hsl(38,72%,52%)")}
            >
              <Lock size={12} />
              {changePassword.isPending ? "Changing..." : "Change Password"}
            </button>
            {pwSaved && (
              <span className="text-xs tracking-widest uppercase" style={{ color: "hsl(38,72%,58%)" }}>
                ✓ Password changed
              </span>
            )}
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
