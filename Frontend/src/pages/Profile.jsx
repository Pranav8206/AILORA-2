import { useEffect, useState } from "react";
import { Pencil, Trash2, Plus, Users, UserPlus } from "lucide-react";
import MemberModal from "../components/MemberModal";

export default function Profile() {
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState({
    id: "",
    age: "",
    gender: "",
    allergies: "",
    chronic_conditions: "",
    habits: "",
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const savedMembers = JSON.parse(
      localStorage.getItem("familyMembers") || "[]"
    );
    setMembers(savedMembers);
  }, []);

  const saveToLocalStorage = (updatedMembers) => {
    localStorage.setItem("familyMembers", JSON.stringify(updatedMembers));
    setMembers(updatedMembers);
  };

  const handleAddOrUpdate = (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      // Check for duplicate ID (case-insensitive)
      const idExists = members.some(
        (m) =>
          m.id.toLowerCase() === form.id.toLowerCase() && m.id !== editingId
      );
      if (idExists) {
        setError("A member with this name already exists.");
        setLoading(false);
        return;
      }

      const newMember = {
        id: editingId || `member-${Date.now()}`,
        ...form,
      };
      const updatedMembers = editingId
        ? members.map((m) => (m.id === editingId ? newMember : m))
        : [...members, newMember];
      saveToLocalStorage(updatedMembers);
      setMsg(
        editingId
          ? "Profile updated successfully!"
          : "Family member added successfully!"
      );
      setForm({
        id: "",
        age: "",
        gender: "",
        allergies: "",
        chronic_conditions: "",
        habits: "",
      });
      setEditingId(null);
      setIsModalOpen(false);
      setTimeout(() => setMsg(""), 3000);
    } catch (e) {
      setMsg("Operation failed. Please try again.");
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (member) => {
    setForm(member);
    setEditingId(member.id);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to remove this family member?")) {
      const updatedMembers = members.filter((m) => m.id !== id);
      saveToLocalStorage(updatedMembers);
      setMsg("Family member removed successfully!");
      setTimeout(() => setMsg(""), 3000);
    }
  };

  const openModal = () => {
    setForm({
      id: "",
      age: "",
      gender: "",
      allergies: "",
      chronic_conditions: "",
      habits: "",
    });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setForm({
      id: "",
      age: "",
      gender: "",
      allergies: "",
      chronic_conditions: "",
      habits: "",
    });
  };

  return (
    <div className="min-h-screen py-8 px-2 sm:px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-6 border-t-4 border-emerald-600">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-emerald-100 p-3 rounded-xl">
                <Users className="w-8 h-8 text-emerald-700" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
                  Family Health Profiles
                </h1>
                <p className="text-slate-600 mt-1 text-sm sm:text-base">
                  Manage your family's health information
                </p>
              </div>
            </div>
            <button
              onClick={openModal}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus className="w-5 h-5" />
              Add Member
            </button>
          </div>
        </div>

        {/* Success Message */}
        {msg && (
          <div
            className={`mb-6 border px-4 sm:px-6 py-4 rounded-xl shadow-sm ${
              msg.includes("already exists")
                ? "bg-red-50 border-red-200 text-red-800"
                : "bg-emerald-50 border-emerald-200 text-emerald-800"
            }`}
          >
            <p className="font-medium text-sm sm:text-base">{msg}</p>
          </div>
        )}

        {/* Member Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {members.length === 0 ? (
            <div className="col-span-full bg-white rounded-2xl shadow-lg p-8 sm:p-12 text-center">
              <div className="bg-emerald-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserPlus className="w-10 h-10 text-emerald-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-slate-800 mb-2">
                No Family Members Yet
              </h3>
              <p className="text-slate-600 mb-6 text-sm sm:text-base">
                Start building your family health profile by adding your first
                member.
              </p>
              <button
                onClick={openModal}
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold transition-all"
              >
                <Plus className="w-5 h-5" />
                Add Your First Member
              </button>
            </div>
          ) : (
            members.map((member) => (
              <div
                key={member.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all p-6 border-l-4 border-emerald-500"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-emerald-100 p-2 rounded-lg">
                      <Users className="w-6 h-6 text-emerald-700" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-slate-800">
                        {member.id}
                      </h3>
                      <p className="text-sm text-slate-500">
                        Family Member Profile
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(member)}
                      className="p-3 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                      title="Edit profile"
                    >
                      <Pencil size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(member.id)}
                      className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete profile"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>

                <div className="space-y-3 text-sm sm:text-base">
                  <div className="flex items-center gap-2 text-slate-700">
                    <span className="font-semibold text-emerald-700 min-w-28 sm:min-w-32">
                      Age:
                    </span>
                    <span>{member.age || "Not specified"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <span className="font-semibold text-emerald-700 min-w-28 sm:min-w-32">
                      Gender:
                    </span>
                    <span className="capitalize">
                      {member.gender || "Not specified"}
                    </span>
                  </div>
                  <div className="flex items-start gap-2 text-slate-700">
                    <span className="font-semibold text-emerald-700 min-w-28 sm:min-w-32">
                      Allergies:
                    </span>
                    <span>{member.allergies || "None reported"}</span>
                  </div>
                  <div className="flex items-start gap-2 text-slate-700">
                    <span className="font-semibold text-emerald-700 min-w-28 sm:min-w-32">
                      Medical Conditions:
                    </span>
                    <span>{member.chronic_conditions || "None reported"}</span>
                  </div>
                  <div className="flex items-start gap-2 text-slate-700">
                    <span className="font-semibold text-emerald-700 min-w-28 sm:min-w-32">
                      Lifestyle Habits:
                    </span>
                    <span>{member.habits || "None reported"}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Member Modal */}
        <MemberModal
          isOpen={isModalOpen}
          editingId={editingId}
          form={form}
          setForm={setForm}
          onSubmit={handleAddOrUpdate}
          onClose={closeModal}
          loading={loading}
          error={error}
          setError={setError}
        />
      </div>
    </div>
  );
}
