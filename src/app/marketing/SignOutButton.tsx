"use client";

// A plain POST form so sign-out clears the httpOnly cookie server-side (the client can't
// read or clear it). The route redirects back to the sign-in page.
export function SignOutButton() {
  return (
    <form action="/api/marketing/auth/signout" method="post">
      <button
        type="submit"
        className="text-[10px] uppercase tracking-[0.25em] text-[#e8dcc8]/50 hover:text-[#c9a96e] transition-colors font-sans cursor-pointer"
      >
        Sign out
      </button>
    </form>
  );
}
