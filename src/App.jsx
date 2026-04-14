import { useEffect, useState } from "react";

function App() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
  });
  const [updateId, setUpdateId] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const getUsers = () => {
    fetch("https://notes-app-1-6a33.onrender.com/read")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  };

  useEffect(() => {
    getUsers();
  }, []);

  const createUser = () => {
    fetch("https://notes-app-1-6a33.onrender.com/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then(() => getUsers());
    setForm({
      name: "",
      username: "",
      email: "",
    });
  };

  const deleteUser = (id) => {
    fetch(`https://notes-app-1-6a33.onrender.com/delete/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => setUsers(users.filter((u) => u._id !== id)))
      .catch((err) => alert("Error : ", err.message));
    setForm({
      name: "",
      username: "",
      email: "",
    });
  };

  const updateUser = () => {
    if (updateId === "") {
      alert("Please select a user to update");
      return;
    }
    fetch(`https://notes-app-1-6a33.onrender.com/update/${updateId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then(() => {
        getUsers();
        setForm({
          name: "",
          username: "",
          email: "",
        });
        setUpdateId("");
      })
      .catch((err) => console.log("Error : ", err));
  };
  return (
    <div>
      <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 text-slate-800">
        {/* Header */}
        <div className="max-w-6xl mx-auto flex items-center justify-center gap-3 mb-10">
          <span className="material-symbols-outlined text-indigo-600 text-4xl">
            description
          </span>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">
            Notes App
          </h1>
        </div>

        {/* Form Container */}
        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 mb-12 max-w-xl mx-auto border border-slate-100">
          <div className="flex items-center gap-2 mb-6 text-indigo-600 font-semibold">
            <span className="material-symbols-outlined">stylus</span>
            <span>{updateId ? "Edit Note" : "Create New Note"}</span>
          </div>

          <div className="space-y-4">
            <input
              className="w-full bg-slate-50 border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 p-3 rounded-xl outline-none transition-all border"
              name="name"
              placeholder="Note Title"
              value={form.name}
              onChange={handleChange}
            />
            <input
              className="w-full bg-slate-50 border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 p-3 rounded-xl outline-none transition-all border"
              name="username"
              placeholder="Subtitle / Category"
              value={form.username}
              onChange={handleChange}
            />
            <textarea
              className="w-full bg-slate-50 border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 p-3 rounded-xl outline-none transition-all border min-h-[100px]"
              name="email"
              placeholder="Note Description"
              value={form.email}
              onChange={handleChange}
            />

            <div className="flex gap-3 pt-2">
              <button
                onClick={createUser}
                className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl w-full transition-all shadow-lg shadow-indigo-100 active:scale-95"
              >
                <span className="material-symbols-outlined text-xl">add</span>
                Create
              </button>
              <button
                onClick={updateUser}
                className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl w-full transition-all shadow-lg shadow-emerald-100 active:scale-95"
              >
                <span className="material-symbols-outlined text-xl">check</span>
                Update
              </button>
            </div>

            <button
              onClick={() => {
                setUpdateId("");
                setForm({
                  name: "",
                  username: "",
                  email: "",
                });
              }}
              className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-500 font-medium py-2 rounded-xl w-full transition-all mt-2"
            >
              <span className="material-symbols-outlined text-lg">
                ink_eraser
              </span>
              Clear Form
            </button>
          </div>
        </div>

        {/* Notes List Grid */}
        <div className="max-w-6xl  mx-auto grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {users.map((u) => (
            <div
              key={u._id}
              className="group p-6 bg-gray-400 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                    {u.name}
                  </h2>
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded mt-1 inline-block">
                    {u.username}
                  </span>
                </div>
                <div className="flex gap-1">
                  {/* Edit Icon */}
                  <button
                    className="p-2 hover:bg-blue-50 text-blue-500 rounded-full transition-colors"
                    onClick={() => {
                      setForm({
                        name: u.name,
                        username: u.username,
                        email: u.email,
                      });
                      setUpdateId(u._id);
                    }}
                  >
                    <span className="material-symbols-outlined">edit</span>
                  </button>

                  {/* Delete Icon */}
                  <button
                    className="p-2 hover:bg-rose-50 text-rose-500 rounded-full transition-colors"
                    onClick={() => deleteUser(u._id)}
                  >
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </div>
              </div>

              <p className="text-slate-600 leading-relaxed text-sm">
                {u.email}
              </p>

              <div className="mt-6 flex items-center justify-between border-t border-slate-50 pt-4">
                <span className="material-symbols-outlined text-slate-300">
                  push_pin
                </span>
                <span className="text-[10px] text-slate-300 font-mono">
                  ID: {u._id.slice(-5)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {users.length === 0 && (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-7xl text-slate-200 mb-4">
              note_stack
            </span>
            <p className="text-slate-400 text-lg">
              Your workspace is empty. Create your first note!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
