import React from "react";
import { UserPlus, X } from "lucide-react";

const MemberModal = ({
  isOpen,
  editingId,
  form,
  setForm,
  onSubmit,
  onClose,
  loading,
  error,
  setError,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-green-600 text-white px-6 sm:px-8 py-6 flex items-center justify-between rounded-t-2xl z-10">
          <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-3">
            <UserPlus className="w-6 sm:w-7 h-6 sm:h-7" />
            {editingId ? "Update Family Member" : "Add New Family Member"}
          </h2>
          <button
            onClick={onClose}
            className="text-white p-2 rounded-lg cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 sm:p-8 space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold text-slate-700 mb-2 block">
                Member Name *
              </span>
              <input
                className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                value={form.id}
                onChange={(e) => {
                  setForm((f) => ({ ...f, id: e.target.value }));
                  setError("");
                }}
                placeholder="e.g., Pranav, Mihir, Atharva"
                required
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-700 mb-2 block">
                Age
              </span>
              <input
                className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                type="number"
                min="0"
                max="150"
                value={form.age}
                onChange={(e) =>
                  setForm((f) => ({ ...f, age: e.target.value }))
                }
                placeholder="e.g., 20"
              />
            </label>
          </div>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700 mb-2 block">
              Gender
            </span>
            <select
              className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white"
              value={form.gender}
              onChange={(e) =>
                setForm((f) => ({ ...f, gender: e.target.value }))
              }
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700 mb-2 block">
              Known Allergies
            </span>
            <input
              className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              value={form.allergies}
              onChange={(e) =>
                setForm((f) => ({ ...f, allergies: e.target.value }))
              }
              placeholder="e.g., Peanuts, Pollen, Penicillin"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700 mb-2 block">
              Chronic Medical Conditions
            </span>
            <input
              className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              value={form.chronic_conditions}
              onChange={(e) =>
                setForm((f) => ({ ...f, chronic_conditions: e.target.value }))
              }
              placeholder="e.g., Diabetes, Hypertension, Asthma"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700 mb-2 block">
              Lifestyle Habits
            </span>
            <input
              className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              value={form.habits}
              onChange={(e) =>
                setForm((f) => ({ ...f, habits: e.target.value }))
              }
              placeholder="e.g., Regular exercise, Non-Vegetarian, Smoker"
            />
          </label>

          {error && <div className="text-sm text-red-800 ml-3">*{error}</div>}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-lg px-4 sm:px-6 py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl cursor-pointer"
            >
              {loading
                ? "Saving..."
                : editingId
                ? "Update Profile"
                : "Add Member"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 sm:px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-all cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MemberModal;
