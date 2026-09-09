import { useState } from "react";
import {
  GraduationCap,
  Mail,
  Lock,
  ArrowRight
} from "lucide-react";

function StudentLogin({ setActivePage }) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ============================================================
  // STUDENT LOGIN
  // ============================================================

  const handleLogin = (e) => {

    e.preventDefault();

    // Student login successful
    setActivePage("dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">

      <div className="w-full max-w-md">

        {/* ====================================================
            LOGO
        ==================================================== */}

        <div className="text-center mb-8">

          <div className="mx-auto mb-4 w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">

            <GraduationCap
              className="w-8 h-8 text-indigo-400"
            />

          </div>

          <h1 className="text-3xl font-bold">
            SkillBridge AI
          </h1>

          <p className="text-slate-400 mt-2">
            Student Portal
          </p>

        </div>


        {/* ====================================================
            LOGIN CARD
        ==================================================== */}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">

          <div className="mb-6">

            <h2 className="text-xl font-semibold">
              Student Login
            </h2>

            <p className="text-sm text-slate-400 mt-1">
              Login to access your career dashboard
            </p>

          </div>


          <form
            onSubmit={handleLogin}
            className="space-y-5"
          >

            {/* ==================================================
                EMAIL
            ================================================== */}

            <div>

              <label className="block text-sm text-slate-300 mb-2">
                Email
              </label>

              <div className="relative">

                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500"
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="student@example.com"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 pl-11 pr-4 outline-none focus:border-indigo-500"
                  required
                />

              </div>

            </div>


            {/* ==================================================
                PASSWORD
            ================================================== */}

            <div>

              <label className="block text-sm text-slate-300 mb-2">
                Password
              </label>

              <div className="relative">

                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500"
                />

                <input
                  type="password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="Enter password"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 pl-11 pr-4 outline-none focus:border-indigo-500"
                  required
                />

              </div>

            </div>


            {/* ==================================================
                LOGIN BUTTON
            ================================================== */}

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 rounded-xl py-3 font-semibold flex items-center justify-center gap-2 transition"
            >

              Login as Student

              <ArrowRight className="w-5 h-5" />

            </button>

          </form>

        </div>

      </div>

    </div>
  );
}

export default StudentLogin;