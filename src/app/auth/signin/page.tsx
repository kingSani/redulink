"use client";

import { useActionState, useState } from "react";
import type { FormEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
import { signInWithEmail } from "./actions";

type FormValues = {
  email: string;
  password: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

const validateField = (field: keyof FormValues, value: string): string => {
  switch (field) {
    case "email":
      if (!value.trim()) return "Email address is required.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
        return "Please enter a valid email address.";
      return "";

    case "password":
      if (!value) return "Password is required.";
      return "";

    default:
      return "";
  }
};

export default function SignInForm() {
  const [state, formAction, isPending] = useActionState(signInWithEmail, null);

  const [values, setValues] = useState<FormValues>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof FormValues, boolean>>
  >({});

  const [showPassword, setShowPassword] = useState(false);
  const [shakeField, setShakeField] = useState<keyof FormValues | null>(null);

  const triggerShake = (field: keyof FormValues) => {
    setShakeField(null);

    requestAnimationFrame(() => {
      setShakeField(field);
    });
  };

  const handleChange = (field: keyof FormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));

    // Update validation without shaking while typing.
    if (touched[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: validateField(field, value),
      }));
    }
  };

  const handleBlur = (field: keyof FormValues) => {
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }));

    const error = validateField(field, values[field]);

    setErrors((prev) => ({
      ...prev,
      [field]: error,
    }));

    if (error) {
      triggerShake(field);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    const fields = Object.keys(values) as (keyof FormValues)[];

    const newErrors: FormErrors = {};

    fields.forEach((field) => {
      const error = validateField(field, values[field]);

      if (error) {
        newErrors[field] = error;
      }
    });

    setErrors(newErrors);

    setTouched({
      email: true,
      password: true,
    });

    if (Object.keys(newErrors).length > 0) {
      event.preventDefault();

      const firstInvalidField = fields.find((field) => newErrors[field]);

      if (firstInvalidField) {
        triggerShake(firstInvalidField);
        document.getElementById(firstInvalidField)?.focus();
      }
    }
  };

  const inputClass = (field: keyof FormValues) => {
    const hasError = touched[field] && errors[field];

    const isValid = touched[field] && !errors[field] && values[field];

    return `
      block w-full rounded-md bg-black/5 dark:bg-white/5
      px-3 py-2 text-zinc-900 dark:text-white
      placeholder:text-gray-500
      outline-none border transition-all duration-300
      focus:ring-2 focus:ring-black/10 dark:focus:ring-white/20
      ${
        hasError
          ? "border-red-500/70 focus:border-red-500"
          : isValid
            ? "border-green-500/50 focus:border-green-500"
            : "border-black/10 dark:border-white/10 focus:border-black dark:focus:border-white"
      }
    `;
  };

  const renderError = (field: keyof FormValues) => {
    if (!touched[field] || !errors[field]) return null;

    return (
      <p
        id={`${field}-error`}
        role="alert"
        className="text-xs text-red-500 dark:text-red-400 animate-[fadeIn_0.2s_ease-out]"
      >
        {errors[field]}
      </p>
    );
  };

  return (
    <form
      action={formAction}
      onSubmit={handleSubmit}
      noValidate
      className="flex min-h-screen w-full flex-col items-center justify-center gap-5 bg-zinc-50 px-4 py-10 font-sans dark:bg-black"
    >
      {/* Heading */}
      <div className="w-full max-w-sm animate-[fadeInUp_0.6s_ease-out]">
        <h1 className="mt-10 text-center text-2xl font-bold text-zinc-900 dark:text-white">
          Sign in to your account
        </h1>

        <p className="mt-2 text-center text-sm text-zinc-500 dark:text-gray-400">
          Welcome back! Enter your details to continue.
        </p>
      </div>

      {/* Email */}
      <div className="flex w-full max-w-sm flex-col gap-1.5">
        <label
          htmlFor="email"
          className="text-sm font-medium text-zinc-700 dark:text-gray-100"
        >
          Email address
        </label>

        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={values.email}
          onChange={(e) => handleChange("email", e.target.value)}
          onBlur={() => handleBlur("email")}
          placeholder="john@my-company.com"
          className={`${inputClass("email")} ${
            shakeField === "email" ? "animate-[shake_0.35s_ease-in-out]" : ""
          }`}
          aria-invalid={!!(touched.email && errors.email)}
          aria-describedby="email-error"
        />

        {renderError("email")}
      </div>

      {/* Password */}
      <div className="flex w-full max-w-sm flex-col gap-1.5">
        <label
          htmlFor="password"
          className="text-sm font-medium text-zinc-700 dark:text-gray-100"
        >
          Password
        </label>

        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            value={values.password}
            onChange={(e) => handleChange("password", e.target.value)}
            onBlur={() => handleBlur("password")}
            placeholder="Enter your password"
            className={`${inputClass("password")} pr-11 ${
              shakeField === "password"
                ? "animate-[shake_0.35s_ease-in-out]"
                : ""
            }`}
            aria-invalid={!!(touched.password && errors.password)}
            aria-describedby="password-error"
          />

          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 transition-colors hover:text-black dark:text-gray-400 dark:hover:text-white"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {renderError("password")}
      </div>

      {/* Better Auth server error */}
      {state?.error && (
        <div
          role="alert"
          className="w-full max-w-sm rounded-md border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-500 dark:text-red-400 animate-[fadeIn_0.2s_ease-out]"
        >
          {state.error}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending}
        className="flex w-full max-w-sm justify-center rounded-md bg-black px-3 py-2 text-sm font-semibold text-white transition-all duration-300 hover:bg-zinc-800 hover:shadow-lg hover:shadow-black/10 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-black dark:hover:bg-gray-200 dark:hover:shadow-white/10"
      >
        {isPending ? (
          <span className="flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current/30 border-t-current" />
            Signing in...
          </span>
        ) : (
          "Sign in"
        )}
      </button>

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          20%,
          60% {
            transform: translateX(-5px);
          }
          40%,
          80% {
            transform: translateX(5px);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </form>
  );
}
