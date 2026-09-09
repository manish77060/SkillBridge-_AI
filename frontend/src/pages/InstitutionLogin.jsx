import { useState } from "react";

import {
  Building2,
  Mail,
  Lock,
  ArrowRight,
  GraduationCap,
  Factory
} from "lucide-react";


function InstitutionLogin({ setActivePage }) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const handleLogin = (e) => {

    e.preventDefault();

    // Institute login
    setActivePage("institution");

  };


  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">

      <div className="w-full max-w-md">

        {/* ==================================================
            LOGO
        ================================================== */}

        <div className="text-center mb-8">

          <div className="mx-auto mb-4 w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">

            <Building2
              className="w-8 h-8 text-amber-400"
            />

          </div>

          <h1 className="text-3xl font-bold">
            SkillBridge AI
          </h1>

          <p className="text-slate-400 mt-2">
            Institute Portal
          </p>

        </div>


        {/* ==================================================
            LOGIN CARD
        ================================================== */}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">

          <div className="mb-6">

            <h2 className="text-xl font-semibold">
              Institute Login
            </h2>

            <p className="text-sm text-slate-400 mt-1">
              Manage students, skills and placement analytics
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
                Institute Email
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
                  placeholder="institute@example.com"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 pl-11 pr-4 outline-none focus:border-amber-500"
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
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 pl-11 pr-4 outline-none focus:border-amber-500"
                  required
                />

              </div>

            </div>


            {/* ==================================================
                LOGIN BUTTON
            ================================================== */}

            <button
              type="submit"
              className="w-full bg-amber-600 hover:bg-amber-500 rounded-xl py-3 font-semibold flex items-center justify-center gap-2 transition"
            >

              Login as Institute

              <ArrowRight className="w-5 h-5" />

            </button>

          </form>

        </div>


        {/* ==================================================
            OTHER PORTALS
        ================================================== */}

        <div className="mt-6">

          <p className="text-center text-sm text-slate-500 mb-3">
            Other portals
          </p>


          <div className="grid grid-cols-2 gap-3">

            {/* STUDENT */}

            <button
              onClick={() =>
                setActivePage("student-login")
              }
              className="border border-slate-800 hover:border-slate-600 bg-slate-900 rounded-xl p-3 flex items-center justify-center gap-2 text-sm transition"
            >

              <GraduationCap className="w-4 h-4" />

              Student

            </button>


            {/* INDUSTRY */}

            <button
              onClick={() =>
                setActivePage("industry-login")
              }
              className="border border-slate-800 hover:border-slate-600 bg-slate-900 rounded-xl p-3 flex items-center justify-center gap-2 text-sm transition"
            >

              <Factory className="w-4 h-4" />

              Industry

            </button>

          </div>

        </div>

      </div>

    </div>
  );
}


export default InstitutionLogin;