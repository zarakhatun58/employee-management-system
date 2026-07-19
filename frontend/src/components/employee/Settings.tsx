import {
  User,
  Lock,
  Bell,
  Palette,
  Save,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuthStore } from "../../store/auth.store";


export default function Settings() {
  const user = useAuthStore((state) => state.user);
  const updateProfile = useAuthStore(
    (state) => state.updateProfile
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notifications, setNotifications] =
    useState(true);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleSave = async () => {
    const success = await updateProfile({
      name,
      email,
    });

    if (success) {
      toast.success("Profile updated successfully");
    }
  };
  return (
    <div className="space-y-6">


      {/* Header */}
      <div>
        <h1 className="
        text-2xl
        font-bold
        text-slate-900
        dark:text-white
        ">
          Settings
        </h1>

        <p className="
        text-sm
        text-slate-500
        dark:text-slate-400
        ">
          Manage your account preferences
        </p>
      </div>



      {/* Profile */}
      <section className="
      rounded-xl
      border
      border-slate-200
      bg-white
      p-6
      dark:border-slate-800
      dark:bg-slate-900
      ">


        <div className="
        mb-5
        flex
        items-center
        gap-3
        ">
          <User size={22} />

          <h2 className="
          font-semibold
          dark:text-white
          ">
            Profile Information
          </h2>
        </div>


        <div className="
        grid
        gap-4
        md:grid-cols-2
        ">

          <input
            className="
  rounded-lg
  border
  border-slate-300
  px-4
  py-2
  dark:border-slate-700
  dark:bg-slate-800
  dark:text-white
  "
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="
  rounded-lg
  border
  border-slate-300
  px-4
  py-2
  dark:border-slate-700
  dark:bg-slate-800
  dark:text-white
  "
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

      </section>




      {/* Security */}
      <section className="
      rounded-xl
      border
      border-slate-200
      bg-white
      p-6
      dark:border-slate-800
      dark:bg-slate-900
      ">


        <div className="
        flex
        items-center
        gap-3
        mb-5
        ">
          <Lock size={22} />
          <h2 className="font-semibold dark:text-white">
            Security
          </h2>
        </div>


        <button
          className="
          rounded-lg
          border
          border-slate-300
          px-4
          py-2
          text-sm
          hover:bg-slate-100
          dark:border-slate-700
          dark:hover:bg-slate-800
          "
        >
          Change Password
        </button>


      </section>




      {/* Preferences */}
      <section className="
      rounded-xl
      border
      border-slate-200
      bg-white
      p-6
      dark:border-slate-800
      dark:bg-slate-900
      ">


        <div className="
        flex
        items-center
        gap-3
        mb-5
        ">
          <Palette size={22} />

          <h2 className="
          font-semibold
          dark:text-white
          ">
            Preferences
          </h2>
        </div>


        <label className="
        flex
        items-center
        justify-between
        ">
          <span className="text-sm dark:text-white">
            Enable Notifications
          </span>
          <input
            type="checkbox"
            checked={notifications}
            onChange={(e) =>
              setNotifications(e.target.checked)
            }
            className="h-5 w-5"
          />
        </label>


      </section>
      <button
        onClick={handleSave}
        className="
  flex
  items-center
  gap-2
  rounded-lg
  bg-sky-600
  px-5
  py-2.5
  text-white
  hover:bg-sky-700
  "
      >
        <Save size={18} />
        Save Changes
      </button>


    </div>
  );
}